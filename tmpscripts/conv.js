import * as fs from 'fs';

//split array into of arrays of size 7
function splitArray(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
        arrays.push(arr.splice(0, size));
    }
    return arrays;
}
 
fs.readFile('./inp.txt', 'utf8', function (err,data) {
/*
    const lines = data.split(/\r?\n/);
    //console.log(splitArray(lines, 7));
    //json to csv
    var json = splitArray(lines, 7);
    var csv = "Index,Name,Liquidity,Volume(24H),Volume(7D),Fees(24H),1y Fees/Liquidity\n"+json.map(function(row) {
        return row.join(',');
    }
    ).join('\n');
*/

    //csv to json with attributes
    var csv = fs.readFileSync('./inp.txt', 'utf8');
    var lines = csv.split(/\r?\n/);
    var json = splitArray(lines, 7);
    /*
    let json = json.map(function(row) {
        return {
            "index": row[0],
            "name": row[1],
            "liquidity": row[2],
            "volume_24h": row[3],
            "volume_7d": row[4],
            "fees_24h": row[5],
            "1y_fees_liquidity": row[6]
        };
    });
    */
    json = json.map(function(row) {
        return {
            "index": row[0],
            "name": row[1],
            "symbol": row[2],
            "liquidity": row[3],
            "volume_24h": row[4],
            "price": row[5],
            "price_change_24h": row[6],
        };
    });
    fs.writeFile('./out.txt', JSON.stringify(json), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

});