//Label　Inputの場合（ボタンなし）
var element2 = document.getElementById("drop_zone2l");
element2.addEventListener("dragover", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
});

element2.addEventListener("drop", function (e) {
	var file = e.dataTransfer.files;
	var data_transfer = e.dataTransfer;
    var type_list = data_transfer.types;
	if(!type_list) return;

    e.preventDefault();

   var filereader = new FileReader();
    filereader.onload = function (e) {
		console.log(filereader.result);
		var tb=filereader.result;

		//ファイル処理
		makeCSV(tb)
	}
	filereader.readAsText(file[0])
	
    document.getElementById("drop-zone2").files = file;
});



//直Inputの場合
var element = document.getElementById("drop-zone");
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


//CSV処理系
//CSVを出力する関数
function makeCSV(csvdata) {

    //5:csvデータを1行ごとに配列にする
    var tmp = csvdata.split("\n");
    console.log(tmp);

}