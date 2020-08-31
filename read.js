//-------------------　ドラッグドロップ　divのみの場合（ボタンなし）--------------------
var element2 = document.getElementById("drop_zone2l");
element2.addEventListener("dragover", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
    element2.style.boxSizing="border-box";
    element2.style.border="Solid 10px #cc2222";
});
element2.addEventListener("dragleave", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
    element2.style.boxSizing="border-box";
    element2.style.border="none";
});

element2.addEventListener("drop", function (e) {
    room_checker();
    element2.style.boxSizing="border-box";
    element2.style.border="none";
	var file = e.dataTransfer.files;
	var data_transfer = e.dataTransfer;
    var type_list = data_transfer.types;
	if(!type_list) return;

    e.preventDefault();

   var filereader = new FileReader();
   if(type_inspection(file)){       //ファイルインスペクション　呼び出しと判定
        filereader.onload = function (e) {
            makeCSV(filereader.result)　　//filereader.result　＝　データ内容
        }
        filereader.readAsText(file[0])
   }
    
});
//--------------------------　ドラッグドロップ　直Inputの場合----------------------------
var element = document.getElementById("drop-zone");
var inputfile = document.getElementById('drop-zone')
element.addEventListener("dragover", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
    element.style.boxSizing="border-box";
    element.style.border="Solid 10px #cc2222";
});
element.addEventListener("dragleave", function (e) {
    e.preventDefault();
    //通常のファイルが開く動作の停止
    element.style.boxSizing="border-box";
    element.style.border="none";
});

var a = inputfile.addEventListener("change", function (e) {
    element.style.boxSizing="border-box";
    element.style.border="none";
    room_checker();
    var file = element.files;
    var reader = new FileReader()

    if (type_inspection(file)) {　　　//ファイルインスペクション　呼び出しと判定
        reader.readAsText(file[0])
        reader.onload = function () {
            makeCSV(reader.result)     //filereader.result　＝　データ内容
        }
    }

}, false);

//ファイルタイプ監査　csv 以外はFalse　csvはtrue　を返す
function type_inspection(f){
    //拡張子判定　Excel　CSVではFile.type ですなおにCSVと出ないため　対策
    var Fname = f[0].name;
    var dotpos = Fname.lastIndexOf("."); //ドット位置
    var Ftype=Fname.slice(dotpos + 1);
    if (Ftype != "csv") {
        alert("CSV以外は使用できません");
        document.getElementById("drop-zone").value = "";
        return false;
    } else {
        return true;
    }

}

//CSV処理系
//CSVを出力する関数
function makeCSV(csvdata) {
    //5:csvデータを1行ごとに配列にする
    var csv_data = csvdata.split("\n");
    var members=[];
    
    for(y=0;y<csv_data.length;y++){    
        var personal=csv_data[y].split(",");
        members[y]=[]
        for(x=0;x<personal.length;x++){
            members[y][x]=personal[x];
        }
    };

    console.log(members);
    name_set(members);
}

function name_set(memberdata){
    var member_count=1;
    var step=2; //座席間隔　デフォルト値2　＝1席おき
    for(i=0;i<room_id_list.length;i+=step){
            if(memberdata[member_count][2]){
            document.getElementById(room_id_list[i]).childNodes[3].innerHTML=memberdata[member_count][1];
            member_count++;
        }
    }
    
}


//部屋の行列数チェック　（1601のような規則的な部屋のみ）
function room_checker(){
    var tag_type=document.getElementById("room").tagName
    var display_style = window.getComputedStyle(document.getElementById('room'));
    if (display_style.display=="grid"){

        var Block = document.getElementById('room');
        //子要素数 (gridの場合　机の総数となる)
        var desk_count = Block.childElementCount ;
        
        var style = window.getComputedStyle(Block);　　//CSSのプロパティ取得
        var grcolu = style.gridTemplateColumns;　　　//grid のCSS　列数取得　
        //空白でスプリットして結果配列の長さを取得　（教室での列数）
        var colm_nums=grcolu.split(" ").length;
        
        var row_nums= Math.ceil(desk_count/colm_nums);　　//行数
        return[desk_count, colm_nums, row_nums]

    }else if(tag_type=="table"){ //さて、、Table タグの場合は？？
        
    }
    

}
var room_id_list=[];
function id_set(){
        var Block = document.getElementById('room');
        var desks = Block.children;
        var[dsck_num,cols,rows]=room_checker();
        console.log(cols,rows)
        var alpha_bet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U"]
        var desk_number=0;
        for(var rl=1; rl<= rows;rl++){
            for(var cl=0; cl< cols; cl++){
                    if(desks[desk_number]){
                        var this_id=(alpha_bet[cl]+"-"+(( '00' + rl ).slice( -2 )));
                        desks[desk_number].id=this_id;
                        desks[desk_number].childNodes[1].innerHTML=this_id;
                        room_id_list.push(this_id);
                        desk_number++;
                    };
            }
            
        }
        var Block = document.getElementById('room');
        var desksa = Block.children;
        console.log(desksa);
}