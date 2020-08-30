var element = document.getElementById("drop-zone");
/*element.addEventListener("dragover", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
});
/*
element.addEventListener("drop", function (e) {
	/*var file = e.dataTransfer.files;
	var data_transfer = e.dataTransfer;
    var type_list = data_transfer.types;
	if(!type_list) return;

    e.preventDefault();

    var filereader = new FileReader();
    filereader.onload = function (e) {
        console.log(filereader.result);
    }
    document.getElementById("drop-zone").files = file;
});*/

var inputfile = document.getElementById('drop-zone')

var a = inputfile.addEventListener("change", function (e) {

    console.log("s")
    var file = element.files;
    var reader = new FileReader()

    //拡張子判定　Excel　CSVではFile.type ですなおにCSVと出ないため　対策
    var Fname = file[0].name;
    var dotpos = Fname.lastIndexOf("."); //ドット位置
    var Ftype=Fname.slice(dotpos + 1);
    if (Ftype != "csv") {
        alert("CSV以外は使用できません");
        return;
    } else {
        reader.readAsText(file[0])
        reader.onload = function () {
            //image.src = reader.result;
            console.log(reader.result)
            makeCSV(reader.result)
        }
    }

}, false);

//CSVを出力する関数
function makeCSV(csvdata) {

    //5:csvデータを1行ごとに配列にする
    var tmp = csvdata.split("\n");
    console.log(tmp);

}
/*
 function loads(){
	var element=document.getElementById("drop-zone");
	console.log("s")
	var file =element.files;
	var reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = function() {
		//image.src = reader.result;
		console.log(reader.result)
	}
 }

function getCSV(url) {
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成、サーバと非同期通信するためのAPI
        req.open("get", url, true); // アクセスするファイルを指定
        req.onload = () => {
            if (req.readyState === 4 && req.status === 0) {
                resolve(convertCSVtoArray(req.responseText));
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = () => {
            reject(new Error(req.statusText));
        };
        req.send(null); // HTTPリクエストの発行
    });
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
    alert(result[0][1])
    return result;
}*/