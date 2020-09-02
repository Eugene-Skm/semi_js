/* ---挿入されるHTML要素のElement取得用事前変数--*/
var sort_selecter,set_wayer,set_nummer;
function basicscription(){  //最も最初の処理
    var newElement = document.createElement("div"); // p要素作成
    //var newContent = document.createTextNode("子要素１"); // テキストノードを作成
    //newElement.appendChild(newContent); // p要素にテキストノードを追加
    newElement.setAttribute("id","arrange_setting"); // p要素にidを設定
    var parentDivs = document.getElementsByTagName("body");
    console.log(parentDivs);
    parentDivs[0].insertBefore(newElement, parentDivs[0].firstChild);

    document.getElementById("arrange_setting").innerHTML="<div id='X' style='display:inline-block;position:absolute;z-index:80;box-sizing:border-box;background:#ffffff;width:400px;min-height:150px;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);padding:5px;box-shadow:#888888 2px 3px 2px;border:solid #cccccc 1px;border-radius:5px;'>このシステムでは生徒を教室机、1列目の左から右、2列目の左から右、3列目。。。という順で並べます。<form name='option_form'style='display:inline-flex;flex-direction:column;width:100%;box-sizing:border-box;padding:10px;'><div><label for='select'>席への割り振り順</label><select name='sort_select' onchange='set_onchanger()'id='sort_order'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='rand'>ランダム順</option></select><select name='sort_select' id='sort_direction' style='display: none; margin: 5px; border: solid 1px #000000;'><option value='up'>昇順</option><option value='down'>降順</option></select></div><div style='display:inline-flex;flex-direction:row;'><label for='select'>席の埋まり方</label><select name='how_set'onchange='set_onchanger()'id='how_set'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='chair'>席間隔指定</option><option value='cols'>列間隔指定</option><option value='check'>市松模様状</option></select><select name='set_num'id='set_num'onchange='set_onchanger()'style='display:inline-block;margin:5px;border:solid 1px #000000;'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option></select></div></form><button id='submit' onclick='name_set()'style='display: block; margin-left: auto;margin-right: auto; width: 50%; cursor: pointer;'>確定</button></div>";
    document.getElementById("arrange_setting").style.display="none"
    sort_selecter=document.getElementById("sort_order");
    set_wayer=document.getElementById("how_set");
    set_nummer=document.getElementById("set_num");

    id_set();　//座席へのIDセット
}
function set_onchanger(){
    var back_result=true;
    if(set_wayer.value=="check"){
        document.getElementById("set_num").style.display="none";
    }else{
        document.getElementById("set_num").style.display="inline-block";
    }
    if(sort_selecter.value=="rand"){
        document.getElementById("sort_direction").style.display="none";
    }else{
        document.getElementById("sort_direction").style.display="inline-block";
    }
    var[dsk_sum,cos,ros]=room_checker();
    var deskfig;
    var sef=parseInt(document.getElementById("set_num").value);
    var error_flg=0;
    if(set_wayer.value=="chair"){
        deskfig=(sef + 1) * (members.length-1)-sef;
        if(deskfig>dsk_sum && sef==1) error_flg=1;
    }else if(set_wayer.value=="cols"){
        var need_rows = Math.floor((members.length-1)/ Math.ceil(cos/(sef + 1)));
        console.log("needrows",need_rows)
        var spare_people=(members.length-1)% Math.ceil(cos/(sef + 1));
        console.log("spare_people",spare_people)
        var neet_desk=need_rows*cos;
        var spare_people_desk=(spare_people*(sef+1))-sef;
        deskfig=neet_desk+spare_people_desk;
        console.log(deskfig)
    }else if(set_wayer.value=="check"){
        if(cos%2==0){
            console.log("DD",(members.length-1)%(cos))
            if((members.length-1)%(cos)<=(cos/2)){
                deskfig=(members.length-1)*2-1;
                console.log("G")
            }else if((members.length-1)%(cos)>(cos/2)){
                deskfig=(members.length-1)*2;
                console.log("G1")
            }
        }else{
            deskfig=members*2;
        }
    }
    console.log(deskfig)

    if(deskfig>dsk_sum&&error_flg==0){
        alert("人数に対し机の数が足りません")
        set_nummer.options[0].selected = true;
        set_wayer.options[0].selected = true;
    }if(deskfig>dsk_sum&&error_flg==1){
        back_result=false;
        alert("この人数はこの教室に入りません")
    }
    console.log("back",back_result)
    return back_result;
    
}

var room_id_list=[];
function id_set(){　//座席へのIDセット
        var Block = document.getElementById('room');
        var desks = Block.children;
        var[dsck_num,cols,rows]=room_checker();
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

/*-------------------データ形成---CSV処理系------------*/
//CSVをデータ化する関数
var members=[];
function makeCSV(csvdata) {
    members=[];
    //5:csvデータを1行ごとに配列にする
    var csv_data = csvdata.split("\n");
    var members_e=[]
    for(y=0;y<csv_data.length;y++){    
        var personal=csv_data[y].split(",");
        members_e[y]=[]
        for(x=0;x<personal.length;x++){
            members_e[y][x]=personal[x];
        }
        
    };
    for (var i = 0; i < members_e.length; ++i) {
        if (members_e[i].length != 1) members.push(members_e[i]);
    }
    console.log(members);
    select_option_set(members);
}
//CSVデータからソート順の選択肢をHTMLとして追加
function select_option_set(m_list){
    for(var t=0;t<m_list[1].length;t++){
        sort_selecter.insertAdjacentHTML('beforeend', '<option value='+t+'">'+m_list[0][t]+'</option>');
    }   
    if(set_onchanger()){
        document.getElementById("arrange_setting").style.display="inline-block";
    }

}
//ユーザーのソート選択に応じてリストの順番変更
function list_sort(ms_data){
    var result=[];
    if(sort_selecter.value=="rand"){
        result.push(ms_data[0])
        for(var u=1;u<ms_data.length;){
            var rand_place=Math.floor(Math.random()*ms_data.length);
            if(result[rand_place]==null){
                result[rand_place]=ms_data[u];
                u++;
            }
            
        }
    }else{

    }
    console.log("final_sort_result",result);
    return result;
}

/*------------------出力系--------------------*/
function name_set(){
    document.getElementById("arrange_setting").style.display="none";

    var memberdata=list_sort(members);
    var classnm = prompt("授業名を入力してください");
    var teachernm = prompt("教員名を入力してください");
    document.getElementById("classdata").innerHTML="授業名："+classnm+"<br>担当教員名："+teachernm;
    var member_count=1;
    
    var step=parseInt(set_nummer.value)+1; //座席間隔　デフォルト値2　＝1席おき
    console.log("step",step)
    for(i=0;i<room_id_list.length;i++){
        document.getElementById(room_id_list[i]).childNodes[3].innerHTML="";
    }
    if(set_wayer.value=="chair"){
        for(i=0;i<room_id_list.length;i+=step){
                if(memberdata[member_count]){
                document.getElementById(room_id_list[i]).childNodes[3].innerHTML=memberdata[member_count][1];
                member_count++;
            }
        }
    }else if(set_wayer.value=="cols"){
        var[dsk_sum,cos,ros]=room_checker();
        var r_count=0;
        for(var r=0; r<dsk_sum; r+=cos){
            for(var b=0; b<cos;b+=step){
                console.log("r_count",r_count);
                if(memberdata[member_count]){
                    document.getElementById(room_id_list[r_count]).childNodes[3].innerHTML=memberdata[member_count][1];
                    member_count++;
                }
                r_count+=step;
            }
            r_count=r_count-(r_count%cos)
        }
    }else if(set_wayer.value=="check"){

    }
}
