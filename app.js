const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing post data that has json format

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ag2417',
    port: 5432
});

app.post('/save_marker', (req, res) => {
    console.log('Data recieved: ' + JSON.stringify(req.body));
    var q = "insert into tbl_markers(name,geom) values(" + "'" + req.body.name + "',ST_GeomFromText('POINT(" + req.body.lon + " " + req.body.lat + ")',4326));";
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.send(dbResponse.rows);
    });
});


const FLOWS = ["auxtimepeakt",
    "bicycledemandothert",
    "cardemandbusinesst", "cardemandothert", "cardemandworkt", "cardistancet", "cartimeoffpeakt", "cartimepeakt",
    "firstwaittimeoffpeakt", "firstwaittimepeakt",
    "invehicletimeoffpeakt", "invehicletimepeakt"];

app.get('/api/get_flowtypes', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(FLOWS);
})

FLOWS.forEach(flow => {
    app.get(`/api/get_flows/${flow}`, (req, res) => {
        console.log('============req', req.query)
        const { minTime, maxTime } = req.query

        var q = `SELECT * FROM ${flow}`;
        q = q.concat(minTime == undefined ? "" : ` where count>=${minTime} and count<=${maxTime};`);


        console.log('---------query', q, req, minTime, minTime == undefined)

        pool.query(q, (err, dbResponse) => {
            if (err) console.log(err);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(dbResponse.rows);
        })
    })
})

app.get(`/api/get_algorithm_output`, (req, res) => {
    const { demandType, modes, s1, s2 } = req.query;
    console.log('》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》query', demandType, modes)
    console.log(s1, s2);
    // const s1 = weights.map((w, i) => `${w}*sum(${groups[i]})`).join('+');
    // const s2 = groups.map(g => `sum(${groups[i]})`).join('+')

    var q = `
    SELECT * FROM 
    temporary_table_demand1('od_temp','${demandType}', '${modes}', '${s1}', '${s2}');
    SELECT * FROM demand_temp;`
    console.log('======================================================================', q)
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
    })
});


app.get(`/api/get_flows/demand`, (req, res) => {
    console.log('============req', req.query)
    const { minTime, } = req.query

    var q = `SELECT * FROM public."${flow}"`;
    q = q.concat(minTime == undefined ? "" : ` where count>=${minTime} and count<=${maxTime};`);


    console.log('---------query', q, req, minTime, minTime == undefined)

    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
    })
})


app.get('/api/get_locations', (req, res) => {
    var q = `SELECT row_to_json(fc)FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM
        (
        SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As
        geometry
        , row_to_json((SELECT l FROM (SELECT abbr::INT,baskod95) As l)) As
        properties
        FROM stockholm_centre_geom As lg
        ) As f ) As fc;`
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows[0].row_to_json);
    })
})



app.get('/api/get_markers_geojson', (req, res) => {
    var q =
        `SELECT row_to_json(fc)FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM
        (
        SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As
        geometry
        , row_to_json((SELECT l FROM (SELECT sampers,baskod95) As l)) As
        properties
        FROM stockholm_centre_geom As lg
        ) As f ) As fc;`

    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);

    });
});

app.get('/api/get_closest_marker', (req, res) => {
    console.log('Request received on the server to sendclosest marker ');
    var lat = req.query.lat;
    var lon = req.query.lon;
    var q =
        `with tbl_to_closest_point as (
            with query_point as
            (
                select (ST_GeomFromText('POINT(${lon} ${lat})', 4326)) as geom 
            )
            select id, name,
            st_distance(st_transform(m.geom, 32633), st_transform((qp.geom), 32633)) as distance, 
            ST_MakeLine(m.geom, qp.geom) as line_geom,
            ST_buffer(m.geom, 0.005) as buffer_geom
            from tbl_markers m, query_point qp 
            order by st_distance(st_transform(m.geom, 32633),st_transform(qp.geom, 32633)) limit 1 
            )
            select row_to_json(fc) FROM
            (
                SELECT 'FeatureCollection' As type,
                array_to_json(array_agg(f)) As features 
                FROM(
                    SELECT 'Feature' As type, 
                            ST_AsGeoJSON(lg.line_geom)::json As geometry, 
                            row_to_json((SELECT l FROM (SELECT id,name,distance) As l
                    )) As properties
                FROM tbl_to_closest_point As lg
                ) As f
            ) As fc
            union all
            select row_to_json(fc2) FROM (
                SELECT 'FeatureCollection' As type, 
                        array_to_json(array_agg(f2)) As features
                FROM (
                    SELECT 'Feature' As type, 
                            ST_AsGeoJSON(lg1.buffer_geom)::json As geometry, 
                            row_to_json((
                                SELECT l FROM (
                                    SELECT id,name,distance) As l)
                                ) As properties
                            FROM tbl_to_closest_point As lg1
                ) As f2 
            ) As fc2;
        `;
    console.log(q);
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.send(dbResponse.rows);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
