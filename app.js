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
        const { minTime, maxTime, minLength, maxLength } = req.query

        var q = `SELECT * FROM ${flow}`;
       // q = q.concat(minTime == undefined ? "" : ` where count>=${minTime} and count<=${maxTime}`,
         //   minLength == undefined? "": 
           // `;INNER JOIN (SELECT * FROM query_temporary_table_od(${maxLength},${minLength})) a ON 
             // ${flow}.origin=a.origin AND ${flow}.dest = a.dest;`)

        //  var q =`/*WITH od_lista AS (SELECT * FROM query_temporary_table_od(${maxLength},${minLength}))*/
        q =` SELECT ${flow}.* FROM ${flow},query_temporary_table_od(${minLength},${minLength})`;
        //  INNER JOIN (SELECT * FROM query_temporary_table_od(${maxLength},${minLength})) a ON 
        //       ${flow}.origin=a.origin AND ${flow}.dest = a.dest;`
        // ; 
  
 
        console.log('---------query', q)

        pool.query(q, (err, dbResponse) => {
            console.log('====================== receive response ', dbResponse)
            if (err) console.log(err);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(dbResponse.rows);
        })
    })
});

FLOWS.forEach(flow => {
    app.get(`/api/get_flows_filtered/${flow}`, (req, res) => {
        console.log('============req', req.query)
        const { minTime, maxTime, minLength, maxLength } = req.query

        // var q = `SELECT * FROM ${flow}`;
        // q = q.concat(minTime == undefined ? "" : ` where count>=${minTime} and count<=${maxTime}`,
        //     minLength == undefined? "": 
        //     `;/*SELECT * FROM query_temporary_table_od(${maxLength},${minLength});*/
        //     /*SELECT * from ${flow},(SELECT * FROM query_temporary_table_od(${maxLength}::DOUBLE PRECISION,${minLength}::DOUBLE PRECISION)) od
        //     WHERE ${flow}.origin=od.origin AND ${flow}.dest = od.dest;*/

         var q =`SELECT od.origin AS origin, od.dest AS dest, ${flow}.count AS count FROM ${flow}, (SELECT A.origin,A.dest,A.count FROM cardistancet A
                WHERE A.count<${maxLength} AND A.count>${minLength}) od
            WHERE ${flow}.origin=od.origin AND ${flow}.dest = od.dest;`
        ;

 
        console.log('---------query', q)

        pool.query(q, (err, dbResponse) => {
            console.log('====================== receive response ', dbResponse)
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
    temporary_table_demand('${demandType}', '${modes}', '${s1}', '${s2}');
/*
    SELECT * FROM demand_temp;*/`
    console.log('======================================================================', q)
    pool.query(q, (err, dbResponse) => {
        console.log('====================== receive response ', dbResponse)
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
    })
    //var q = `
    //SELECT * FROM demand_temp;`
    //console.log('======================================================================', q)
    //pool.query(q, (err, dbResponse) => {
    //    console.log('====================== receive response ', dbResponse)
    //    if (err) console.log(err);
    //    res.setHeader('Access-Control-Allow-Origin', '*');
    //    res.send(dbResponse.rows);
    //})
});


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


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
