function basicscription(){  //最も最初の処理
    var newElement = document.createElement("div"); // p要素作成
    //var newContent = document.createTextNode("子要素１"); // テキストノードを作成
    //newElement.appendChild(newContent); // p要素にテキストノードを追加
    newElement.setAttribute("id","arrange_setting"); // p要素にidを設定
    var parentDiv = document.getElementById("dynamicdz");
    var parentDivs = document.getElementsByTagName("body");
    parentDiv.insertBefore(newElement, parentDivs[0].firstChild);

    document.getElementById("arrange_setting").innerHTML="<div id='X' style='display:inline-block;position:absolute;z-index:80;box-sizing:border-box;background:#ffffff;width:400px;min-height:150px;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);padding:5px;box-shadow:#888888 2px 3px 2px;border:solid #cccccc 1px;border-radius:5px;'>このシステムでは生徒を教室机、1列目の左から右、2列目の左から右、3列目。。。という順で並べます。<form style='display:inline-flex;flex-direction:column;width:100%;box-sizing:border-box;padding:10px;'><div><label for='select'>ソート順(生徒の割り振り順)</label><select name='sort_select'id='sort_order'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='rand'>ランダム順</option></select></div><div style='display:inline-flex;flex-direction:row;'><label for='select'>席の埋まり方</label><select name='sort_select'id='sort_order'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='rand'>席間隔指定</option><option value='rand'>列間隔指定</option><option value='rand'>市松模様状</option></select><select name='sort_select'id='sort_order'style='display:inline-block;margin:5px;border:solid 1px #000000;'><option value='rand'>1</option><option value='rand'>2</option><option value='rand'>3</option></select></div></form><button id='submit' onclick='name_set()'style='display: block; margin-left: auto;margin-right: auto; width: 50%; cursor: pointer;'>確定</button></div>";
    document.getElementById("arrange_setting").style.display="none"

    id_set();　//座席へのIDセット
}

var room_id_list=[];
function id_set(){　//座席へのIDセット
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


//-------------------　ドラッグドロップ　のみの場合（ボタンなし）--------------------
// IDさえあればどこでもできる　Bodyでも　HTMLでも　Divでも　
//ただしユニバーサルデザイン的にはどうなのか
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

String.prototype.toUnicode = function(){
    var result = [];
    for(var i = 0; i < this.length; i++){
        result.push("\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4));
    }
    return result;
};
element2.addEventListener("drop", function (e) {
    element2.style.boxSizing="border-box";
    element2.style.border="none";
	var file = e.dataTransfer.files;
	var data_transfer = e.dataTransfer;
    var type_list = data_transfer.types;
	if(!type_list) return;

    e.preventDefault();
    
   
   if(type_inspection(file)){       //ファイルインスペクション　呼び出しと判定
        //複数文字コード対応チャレンジの残骸
        //var charset_list=["Shift-jis","utf-8","UTF-16","EUC-JP"]
        //var trycount=0;
        
        
        var filereader = new FileReader();
        filereader.onload = function (e) {
            
            var replacementCharacter = '\\ufffd';
            var fresult=filereader.result.toUnicode()
            for (var i = 0, len = fresult.length; i < len; i++) {
                if ( replacementCharacter == fresult[i] ) {
                    alert('文字化けがあります');
                    trycount++;
                }
                else {                    
                    flg=1;
                    
                }
                
            }
            makeCSV(filereader.result);　　//filereader.result　＝　データ内容
            
        }
        
        
        filereader.readAsText(file[0],"Shift-jis");
        
        //複数文字コード対応チャレンジの残骸
        //filereader.readAsText(file[0],charset_list[trycount]);
        
       /* if(flg==1){
            makeCSV(filereader.result);
        }else if(trycount>=charset_list.length && flg==0){
            alert("ファイルエンコーディングエラーです。")
        }*/
        //reader.readAsText(fileData, 'Shift_JIS');
   }
    
});
//--------------------------　ドラッグドロップ　直Inputの場合----------------------------
//Inputがないとできないので制約がある
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

/*-------------------データ形成---------------*/

//CSV処理系
//CSVを出力する関数
var members=[];
function makeCSV(csvdata) {
    //5:csvデータを1行ごとに配列にする
    var csv_data = csvdata.split("\n");
    
    
    for(y=0;y<csv_data.length;y++){    
        var personal=csv_data[y].split(",");
        members[y]=[]
        for(x=0;x<personal.length;x++){
            members[y][x]=personal[x];
        }
    };

    document.getElementById("arrange_setting").style.display="inline-block";
}
/*document.getElementById("submit").onclick= function () {
    name_set();
};*/

/*------------------出力系--------------------*/
function name_set(){
    document.getElementById("arrange_setting").style.display="none";

    memberdata=members;
 console.log(memberdata,members)
    var classnm = prompt("授業名を入力してください");
    var teachernm = prompt("教員名を入力してください");
    document.getElementById("classdata").innerHTML="授業名："+classnm+"<br>担当教員名："+teachernm;
    var member_count=1;
    var step=2; //座席間隔　デフォルト値2　＝1席おき
    for(i=0;i<room_id_list.length;i++){
        console.log("s")
        document.getElementById(room_id_list[i]).childNodes[3].innerHTML="";
    }
    for(i=0;i<room_id_list.length;i+=step){
            if(memberdata[member_count][2]){
            document.getElementById(room_id_list[i]).childNodes[3].innerHTML=memberdata[member_count][1];
            member_count++;
            console.log(memberdata[member_count][1])
        }
    }
    
}
