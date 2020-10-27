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
    password: 'forever21D',
    port: 5433
});

app.post('/save_marker', (req, res) => {
    console.log('Data recieved: ' + JSON.stringify(req.body));
    var q = "insert into tbl_markers(name,geom) values(" + "'" + req.body.name + "',ST_GeomFromText('POINT(" + req.body.lon + " " + req.body.lat + ")',4326));";
    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.send(dbResponse.rows);
    });
});


const FLOWS = [
    "bicycledemandothert","bicycledemandother_full","cardemandother_full","cardemandwork_full","cardemandbusiness_full","cardistance_full","transitdemandother_full","transitdemandbusiness_full",
    "transitdemandwork_full","walkdemandother_full","walkdemandwork_full",
    "cardemandbusinesst", "cardemandother_full", "cardemandworkt", "cardistancet"];

app.get('/api/get_flowtypes', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(FLOWS);
})

FLOWS.forEach(flow => {
    app.get(`/api/get_flows/${flow}`, (req, res) => {
        console.log('============req', req.query)
        const { minLength, maxLength,name_2 } = req.query

        var q = `SELECT * FROM ${flow};`
        if (name_2.includes('All')) {
            q = `WITH
                 b AS (SELECT * FROM query_temporary_table_od1(${maxLength},${minLength})) 
                       SELECT a.* FROM ${flow} a,b WHERE (a.origin=b.origin AND a.dest=b.dest) ;`
        } else if (!name_2) {
            q = `     
                          WITH c AS (SELECT abbr FROM basemma WHERE name_2 = 'Stockholm'),
                               d  AS (SELECT abbr FROM basemma WHERE name_2 = 'Stockholm'),
                               b AS (SELECT * FROM query_temporary_table_od1(${maxLength},${minLength}))
                               
                          SELECT a.* FROM ${flow} a,b,c,d WHERE (a.origin=b.origin AND a.dest=b.dest) 
                          AND (c.abbr=a.origin AND d.abbr=a.dest);`
        } else {    q = `     
                          WITH c AS (SELECT abbr FROM basemma WHERE name_2 IN (${name_2})),
                               d  AS (SELECT abbr FROM basemma WHERE name_2 IN (${name_2})),
                               b AS (SELECT * FROM query_temporary_table_od1(${maxLength},${minLength})) 

                          SELECT a.* FROM ${flow} a,b,c,d WHERE (a.origin=b.origin AND a.dest=b.dest) 
                          AND (c.abbr=a.origin AND d.abbr=a.dest);`;}

        console.log('---------query', q)

        pool.query(q, (err, dbResponse) => {
            console.log('====================== receive response ', dbResponse)
            if (err) console.log(err);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(dbResponse.rows);
        })
    })
});

app.get(`/api/get_algorithm_output`, (req, res) => { 
    const { demandType, modes, s1, s2, name_2 } = req.query;
    console.log('》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》query', demandType, modes)
    console.log(s1, s2,name_2);
    var q = `SELECT * FROM  temporary_table_demand('${demandType}', '${modes}','${s1}', '${s2}') ;`;
    if (String(name_2).includes('All')||!name_2) {
     q =    `WITH dem AS (SELECT a.* FROM 
             temporary_table_demand('${demandType}','${modes}', '${s1}', '${s2}',${modes.length}) a WHERE a.count <>0
             ), mm AS ( SELECT min(count) AS min, max(count) AS max from dem)
             
             SELECT origin,dest,100*((count-min)/(max-min+0.000000001))::real AS count FROM dem,mm GROUP BY origin,dest,count,min,max;`;
    }    else {
    q = ` WITH dem AS (WITH c AS (SELECT abbr FROM basemma WHERE name_2 IN (${name_2})),
                            d  AS (SELECT abbr FROM basemma WHERE name_2 IN (${name_2}))
    
                       SELECT a.* FROM 
                        temporary_table_demand('${demandType}', '${modes}','${s1}', '${s2}',${modes.length}) a,
                        c,d WHERE (a.origin = c.abbr AND a.dest = d.abbr) AND a.count <> 0),
               mm AS ( SELECT min(count) AS min, max(count) AS max from dem)

          SELECT origin,dest,100*((count-min)/(max-min+0.000000001))::real AS count 
          FROM dem,mm GROUP BY origin,dest,count,min,max;`;
    }
    console.log('======================================================================', q)
    pool.query(q, (err, dbResponse) => {
        console.log('====================== receive response ', dbResponse)
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);
        a = dbResponse.rows;
    })
});


app.get('/api/get_locations', (req, res) => {
    var q = `SELECT row_to_json(fc)FROM (
        SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM
        (
        SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As
        geometry
        , row_to_json((SELECT l FROM (SELECT abbr::INT,baskod95) As l)) As
        properties
        FROM basemma As lg
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
        , row_to_json((SELECT l FROM (SELECT abbr::INT,baskod95) As l)) As
        properties
        FROM basemma As lg
        ) As f ) As fc;`

    pool.query(q, (err, dbResponse) => {
        if (err) console.log(err);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(dbResponse.rows);

    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
