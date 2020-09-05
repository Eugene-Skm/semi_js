/*------------------------description-------------------------------------- */
//HTML編集時は各所（5-10個）にあるgetByElementId()に注意する
//HTML側は部屋を形成するWrapper部分、ドロップゾーン部分に　id　が必要
//Table型Room未対応
//CSV読み込みは　Sjis型
/*------------------------description-------------------------------------- */
/* ---挿入されるHTML要素のElement取得用事前変数--*/
var first_load=0;
var Elemant_sort_sel,Element_set_way,Element_pitch,Element_arrange_set,Element_sort_dir;
var Elemant_room=document.getElementById('room');
function basicscription(){  //最も最初の処理
    var newElement = document.createElement("div"); // p要素作成
    //var newContent = document.createTextNode("子要素１"); // テキストノードを作成
    //newElement.appendChild(newContent); // p要素にテキストノードを追加
    newElement.setAttribute("id","arrange_setting"); // p要素にidを設定
    var parentDivs = document.getElementsByTagName("body");
    parentDivs[0].insertBefore(newElement, parentDivs[0].firstChild);
    Element_arrange_set=document.getElementById("arrange_setting");

    Element_arrange_set.innerHTML="<div id='X' style='display:inline-block;position:absolute;z-index:80;box-sizing:border-box;background:#ffffff;width:400px;min-height:150px;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);padding:5px;box-shadow:#888888 2px 3px 2px;border:solid #cccccc 1px;border-radius:5px;'>このシステムでは生徒を教室机、1列目の左から右、2列目の左から右、3列目。。。という順で並べます。<form name='option_form'style='display:inline-flex;flex-direction:column;width:100%;box-sizing:border-box;padding:10px;'><div><label for='select'>席への割り振り順</label><select name='sort_select' onchange='set_onchanger()'id='sort_order'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='rand'>ランダム順</option></select><select name='sort_select' id='sort_direction' style='display: none; margin: 5px; border: solid 1px #000000;'><option value='up'>昇順</option><option value='down'>降順</option></select></div><div style='display:inline-flex;flex-direction:row;'><label for='select'>席の埋まり方</label><select name='how_set'onchange='set_onchanger()'id='how_set'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='chair'>席間隔指定</option><option value='cols'>列間隔指定</option><option value='check'>市松模様状</option></select><select name='set_num'id='set_num'onchange='set_onchanger()'style='display:inline-block;margin:5px;border:solid 1px #000000;'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option></select></div></form><button id='submit' onclick='name_set()'style='display: block; margin-left: auto;margin-right: auto; width: 50%; cursor: pointer;'>確定</button></div>";
    
    Elemant_sort_sel=document.getElementById("sort_order");
    Element_set_way=document.getElementById("how_set");
    Element_pitch=document.getElementById("set_num");
    Element_sort_dir=document.getElementById("sort_direction");
    
    Element_arrange_set.style.display="none"
    id_set();　//座席へのIDセット
}
function set_onchanger(){
    var back_result=true;
    if(Element_set_way.value=="check"){
        Element_pitch.style.display="none";
    }else{
        Element_pitch.style.display="inline-block";
    }
    if(Elemant_sort_sel.value=="rand"){
        Element_sort_dir.style.display="none";
    }else{
        Element_sort_dir.style.display="inline-block";
    }
    var[dsk_sum,cos,ros]=room_checker();
    var deskfig;
    var sef=parseInt(Element_pitch.value);
    var error_flg=0;
    if(Element_set_way.value=="chair"){
        deskfig=(sef + 1) * (members.length-1)-sef;
        if(deskfig>dsk_sum && sef==1) error_flg=1;
    }else if(Element_set_way.value=="cols"){
        var need_rows = Math.floor((members.length-1)/ Math.ceil(cos/(sef + 1)));
        var spare_people=(members.length-1)% Math.ceil(cos/(sef + 1));
        var neet_desk=need_rows*cos;
        var spare_people_desk=(spare_people*(sef+1))-sef;
        deskfig=neet_desk+spare_people_desk;
    }else if(Element_set_way.value=="check"){
        if(cos%2==0){
            if((members.length-1)%(cos)<=(cos/2)){
                deskfig=(members.length-1)*2-1;
            }else if((members.length-1)%(cos)>(cos/2)){
                deskfig=(members.length-1)*2;
            }
        }else{
            deskfig=members*2;
        }
    }
    console.log("needdesk",deskfig)

    if(deskfig>dsk_sum&&error_flg==0){
        alert("人数に対し机の数が足りません")
        Element_pitch.options[0].selected = true;
        Element_set_way.options[0].selected = true;
    }if(deskfig>dsk_sum&&error_flg==1){
        back_result=false;
        alert("この人数はこの教室に入りません")
    }
    return back_result;
}

var room_id_list=[];
function id_set(){　//座席へのIDセット
    var desks = Elemant_room.children;
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
}

//部屋の行列数チェック　（1601のような規則的な部屋のみ）
function room_checker(){
    var tag_type=Elemant_room.tagName;
    var display_style = window.getComputedStyle(Elemant_room);
    if (display_style.display=="grid"){

        //子要素数 (gridの場合　机の総数となる)
        var desk_count = Elemant_room.childElementCount ;
        
        var style = window.getComputedStyle(Elemant_room);　　//CSSのプロパティ取得
        var grcolu = style.gridTemplateColumns;　　　//grid のCSS　列数取得　
        //空白でスプリットして結果配列の長さを取得　（教室での列数）
        var colm_nums=grcolu.split(" ").length;
        var row_nums= Math.ceil(desk_count/colm_nums);　　//行数
        
    }else if(tag_type=="table"){ //さて、、Table タグの場合は？？

    }
    return[desk_count, colm_nums, row_nums]; //結果返却
}

//-------------------　ドラッグドロップ　のみの場合（ボタンなし）--------------------
// IDさえあればどこでもできる　Bodyでも　HTMLでも　Divでも　
//ただしユニバーサルデザイン的にはどうなのか
var element2 = document.getElementById("drop_zone2"); 
element2.addEventListener("dragover", function (e) {
    e.preventDefault();     //通常のファイルが開く動作の停止
    drag_Effect_on(element2);
});
element2.addEventListener("dragleave", function (e) {
    e.preventDefault();     //通常のファイルが開く動作の停止
    drag_Effect_off(element2);
});

element2.addEventListener("drop", function (e) { //divの場合はdropイベントが使える
    drag_Effect_off(element2);
    var file = e.dataTransfer.files;  //ファイルデータ読み込み div ver
    e.preventDefault();

   if(type_inspection(file)){       //ファイルインスペクション　呼び出しと判定
        encode_error_check(file);
    }
   element.value = "";
});
//--------------------------　ドラッグドロップ　直Inputの場合----------------------------
//Inputがないとできないので制約がある
var element = document.getElementById("drop-zone");
//var inputfile = document.getElementById('drop-zone')
element.addEventListener("dragover", function (e) {
    drag_Effect_on(element);
});
element.addEventListener("dragleave", function (e) {
    drag_Effect_off(element);
});
//Input にファイルが入った検出はchange
var a = element.addEventListener("change", function (e) {  
    drag_Effect_off(element);
    var file = element.files;       //ファイルデータ読み込み input ver
    
    if (type_inspection(file)) {　　　//ファイルインスペクション　呼び出しと判定
        encode_error_check(file);
    }
    element.value = "";
}, false);

/*--------------------ドラッグドロップエフェクト--------------------*/
function drag_Effect_on(Ele){
    Ele.style.boxSizing="border-box";
    Ele.style.border="Solid 10px #cc2222";
}
function drag_Effect_off(Ele){
    Ele.style.boxSizing="border-box";
    Ele.style.border="none";
}

/*------------------ファイルタイプ監査　csv xls以外はFalse------------------*/
function type_inspection(f){
    //拡張子判定　Excel　CSVではFile.type ですなおにCSVと出ないため　対策
    var Fname = f[0].name;
    var dotpos = Fname.lastIndexOf("."); //ドット位置
    var Ftype=Fname.slice(dotpos + 1);
    if (Ftype == "xls"||Ftype == "csv") {
        return true;
    } else {
        alert("CSV以外は使用できません");
        element.value = "";
        return false;
    }
}
//https://kazunori-miura.tumblr.com/post/184943707351/javascriptで文字化けを検知する
String.prototype.toUnicode = function(){
    var result = [];
    for(var i = 0; i < this.length; i++){
        result.push("\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4));
    }
    return result;
};
/*----------------------ファイルの文字コードエラー検出----------------------*/
var filereader = new FileReader();
function encode_error_check(f){
    filereader.readAsText(f[0],"Shift-jis");
    filereader.onload = function (e) {
        var trycount=0;
        var replacementCharacter = '\\ufffd';
        var fresult=filereader.result.toUnicode()
        for (var i = 0, len = fresult.length; i < len; i++) {
            if ( replacementCharacter == fresult[i] ) {
                trycount++;
            }
        }
        if(trycount==0){
            makeCSV(filereader.result);
        }else{
            alert("文字化けがあります。うまく読み込めませんでした");
            return false;
        }
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
        if (members_e[i].length != 1){  //空配列削除
            members.push(members_e[i]);
        }
    }
    console.log(members);
    if(first_load==0){
        select_option_set(members);
    }else{
        if(set_onchanger()){
            Element_arrange_set.style.display="inline-block";
        }
    }
}
//CSVデータからソート順の選択肢をHTMLとして追加
function select_option_set(m_list){
    for(var t=0;t<m_list[1].length;t++){
        Elemant_sort_sel.insertAdjacentHTML('beforeend', '<option value='+t+'">'+m_list[0][t]+'</option>');
    }   
    if(set_onchanger()){
        Element_arrange_set.style.display="inline-block";
    }
    first_load=99;
}

//ユーザーのソート選択に応じてリストの順番変更
function list_sort(ms_data){    
    var result=[];
    if(Elemant_sort_sel.value=="rand"){　　//ランダム選択
        result.push(ms_data[0]);
        for(var u=1;u<ms_data.length;){
            var rand_place=Math.floor(Math.random()*ms_data.length);
            if(result[rand_place]==null){　//結果出力様配列の指定箇所が空だった場合
                result[rand_place]=ms_data[u];　//挿入
                u++;
            }
        }
    }else{                              //指定の列内容で並べかえ
        var col_index=parseInt(Elemant_sort_sel.value);
        var dire= Element_sort_dir.value;
        console.log(col_index,dire)
        var firrow=ms_data[0];
        ms_data.shift();
        if(dire=="up"){     // 昇順
            result= ms_data.sort(function(a, b) {
                A=a[col_index].toString();
                B=b[col_index].toString();
                return A.localeCompare(B,'ja');
            });
        }else{              // 降順
            result= ms_data.sort(function(a, b) {
                A=a[col_index].toString();
                B=b[col_index].toString();
                return B.localeCompare(A,'ja');
            });
        }
        ms_data.unshift(firrow);
    console.log("fresult",result);
    }
    console.log("final_sort_result",result);
    return result;
}

/*------------------出力系--------------------*/
function name_set(){
    Element_arrange_set.style.display="none";

    var memberdata=list_sort(members);
    var classnm = prompt("授業名を入力してください");
    var teachernm = prompt("教員名を入力してください");
    document.getElementById("classdata").innerHTML="授業名："+classnm+"<br>担当教員名："+teachernm;
    var member_count=1;
    
    var step=parseInt(Element_pitch.value)+1; //座席間隔　デフォルト値2　＝1席おき
    for(i=0;i<room_id_list.length;i++){
        document.getElementById(room_id_list[i]).childNodes[3].innerHTML="";
    }
    var[dsk_sum,cos,ros]=room_checker();
    if(Element_set_way.value=="chair"){
        for(i=0;i<room_id_list.length;i+=step){
                if(memberdata[member_count]){
                document.getElementById(room_id_list[i]).childNodes[3].innerHTML=memberdata[member_count][1];
                member_count++;
            }
        }
    }else if(Element_set_way.value=="cols"){
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
    }else if(Element_set_way.value=="check"){
        var roop_flg=0;
        var row_check=0;
        var index_counter=0;
        while(index_counter<dsk_sum&&roop_flg==0){
            console.log(index_counter,dsk_sum);
            for(var h=0; h<cos;h+=step){
                if(memberdata[member_count]){
                    document.getElementById(room_id_list[index_counter]).childNodes[3].innerHTML=memberdata[member_count][1];
                    member_count++;
                    index_counter+=step;
                }else if(!memberdata[member_count]){
                    console.log("#")
                    roop_flg=1;
                }
            }
            if(cos%2==0){
                if(row_check%2==0){
                    index_counter++;
                }else if(row_check%2==1){
                    index_counter--;
                }
            }else if(cos%2==1){
                //nothing
            }
            row_check++;
        }
    }
}
