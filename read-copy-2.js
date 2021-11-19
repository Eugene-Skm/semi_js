/*------------------------description-------------------------------------- */
//HTML編集時は各所（5-10個）にあるgetByElementId()に注意する
//HTML側は部屋を形成するWrapper部分、ドロップゾーン部分に　id　が必要
//Grid型Room未対応
//CSV読み込みは　Sjis型
/*------グローバル変数--------*/
var use_desk_element;
let Room, Students, Room_inspect;
var Elemant_sort_sel,Element_set_way,Element_pitch,Element_arrange_set,Element_sort_dir,Element_1col_emp,Elem_teach_nm,Elem_class_nm;
var alpha_bet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U"];

function basicscription(){  //最も最初の処理
    var newElement = document.createElement("div"); // p要素作成
    newElement.setAttribute("id","arrange_setting"); // p要素にidを設定
    var parentDivs = document.getElementsByTagName("body");
    parentDivs[0].insertBefore(newElement, parentDivs[0].firstChild);
    Element_arrange_set=document.getElementById("arrange_setting");

    Element_arrange_set.innerHTML="<div id='X' style='display:inline-block;position:absolute;z-index:80;box-sizing:border-box;background:#ffffff;width:400px;min-height:150px;height:auto;top:50%;left:50%;transform:translate(-50%,-50%);padding:5px;box-shadow:#888888 2px 3px 2px;border:solid #cccccc 1px;border-radius:5px;'>このシステムでは生徒を教室机、1列目の左から右、2列目の左から右、3列目。。。という順で並べます。<form name='option_form'style='display:inline-flex;flex-direction:column;width:100%;box-sizing:border-box;padding:10px;'><div><label for='select'>席への割り振り順</label><select name='sort_select' onchange='set_onchanger()'id='sort_order'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='rand'>ランダム順</option></select><select name='sort_select' id='sort_direction' style='display: none; margin: 5px; border: solid 1px #000000;'><option value='up'>昇順</option><option value='down'>降順</option></select></div><div style='display:inline-flex;flex-direction:row;'><label for='select'>席の埋まり方</label><select name='how_set'onchange='set_onchanger()'id='how_set'style='display:inline-block;margin:5px;border:solid1px#000000;'><option value='chair'>席間隔指定</option><option value='cols'>列間隔指定</option><option value='check'>市松模様状</option></select><select name='set_num'id='set_num'onchange='set_onchanger()'style='display:inline-block;margin:5px;border:solid 1px #000000;'><option value=1>1</option><option value=2>2</option><option value=3>3</option></select></div><div style='display:inline-flex;flex-direction:row;'><input type='checkbox' id='1column_empty' style='display:inline-block;' onchange='set_onchanger()'><label for='1column_empty'>一列目を開ける</label></div><div style='display:inline-flex;flex-direction:row;'><p>クラス名</p><input type='text' id='class_name'></div><div style='display:inline-flex;flex-direction:row;'><p>教員名</p><input type='text' id='teacher_name'></div></form><button id='submit' onclick='name_set()'style='display: block; margin-left: auto;margin-right: auto; width: 50%; cursor: pointer;'>確定</button></div>";
    
    Elemant_sort_sel = document.getElementById("sort_order");
    Element_set_way = document.getElementById("how_set");
    Element_pitch = document.getElementById("set_num");
    Element_sort_dir = document.getElementById("sort_direction");
    Element_1col_emp= document.getElementById("1column_empty");
    Element_arrange_set.style.display="none"
    Elem_class_nm=document.getElementById("class_name");
    Elem_teach_nm=document.getElementById("teacher_name");

    Room = new room_data();
    Room.desk_id_set();
    Room_inspect = new room_inspector();
}

function set_onchanger(){
    Element_pitch.style.display = ( Element_set_way.value == "check" ) ? "none" : "inline-block";
    Element_sort_dir.style.display = ( Elemant_sort_sel.value=="rand" ) ? "none" : "inline-block";
    Room_inspect.first_empty = (Element_1col_emp.checked) ? true : false

    Room_inspect.type= Element_set_way.value;
    Room_inspect.use_id_decision();

    if(Students.member_count > Room.desk_elements.length ){
        alert("机が足りねえ");
        return false;
    }
    if(Students.member_count > use_desk_element.length){
        alert("机が足りねえ");
        Element_pitch.options[0].selected = true;
        Element_set_way.options[0].selected = true;
        Room_inspect.type= Element_set_way.value;
        Room_inspect.use_id_decision();
    }
    return true;
}

class room_data{
    constructor() {
        this.room_datas;
        this.chair_data;
        this.retu_count=0;
        this.gyou_count=0;
        this.retu_consists=[];
        this.desk_elements=[];

        this.async();
    }
    async() { //縦横指定で必要か？
        this.room_datas = document.querySelectorAll('tbody')[0];
        this.chair_data = document.querySelectorAll('td');
        this.retu_count = document.querySelectorAll('tr').length;
        for(var i =0; i < this.retu_count; i++ ){
            this.retu_consists.push(this.room_datas.children[i]);
            if(this.room_datas.children[i].children.length > this.gyou_count){
                this.gyou_count=this.room_datas.children[i].children.length;
            }
            
        }
    }
    desk_id_set(){
        for(var num=0; num < this.room_datas.children.length; num++){
            var option=0;
            if(this.room_datas.children[num].children.length < this.gyou_count){
                option = (this.gyou_count- this.room_datas.children[num].children.length)/2
            }
            for( var head =0; head < this.room_datas.children[num].children.length; head++){
                var this_id=(alpha_bet[head+option]+"-"+(( '00' + (num + 1 )).slice( -2 )));
                
                this.room_datas.children[num].children[head].id = this_id;
                this.room_datas.children[num].children[head].children[0].innerHTML = this_id;
                this.desk_elements.push(this.room_datas.children[num].children[head]);
            }
        }
    }
}

class students_data{
    constructor(data) {
        this.member_count=data.length;
        var students_json = JSON.stringify(data);
        sessionStorage.setItem("tmp_studentsdata",students_json);
    }
    member_set(data){

    }
    
}

class room_inspector extends room_data {
    constructor(){
        super();
        super.desk_id_set();
        this.first_empty=false;
        this.type ="chair";
    }
    use_id_decision(){
        use_desk_element=[];
        var start_point=0,check_start_point=0;
        if(this.first_empty){
            start_point = this.retu_consists[0].children.length;
            check_start_point = 1;
        }
        var pitch=parseInt(Element_pitch.value )+ 1
        if( this.type == "chair"){
            for(var i = start_point; i < this.desk_elements.length; i+=pitch){
                use_desk_element.push(this.desk_elements[i]);
            }
        }else if( this.type == "cols"){
            var use_al=[];
            for(var i = 0; i < alpha_bet.length; i+=pitch ){
                use_al.push(alpha_bet[i]);
            }
            for(var u=start_point;u < this.desk_elements.length; u++ ){
                if(use_al.indexOf(this.desk_elements[u].id.slice(0,1))!=-1){
                    use_desk_element.push(this.desk_elements[u]);
                }
            }
        }else if( this.type == "check"){
            for(var i=check_start_point; i < this.room_datas.children.length; i++){
                let use_char = ( i % 2 ==0) ? ["B","D","F","H","J","L","N","P","R","T","V"] : ["A","C","E","G","I","K","M","O","Q","S","U"]; //市松模様のため　行ごとに使用アルファベットを変更
                for(var u=0; u<this.room_datas.children[i].children.length; u++ ){
                    if(use_char.indexOf(this.room_datas.children[i].children[u].id.slice(0,1))!=-1){
                        use_desk_element.push(this.room_datas.children[i].children[u]);
                    }
                }
            }
        }
    }
}
/*------------------出力系--------------------*/
function name_set(){
    Element_arrange_set.style.display="none";

    var memberdata=list_sort(members);
    document.getElementById("classdata").innerHTML="授業名："+Elem_class_nm.value+"<br>担当教員名："+Elem_teach_nm.value+"<br>学生数："+(members.length-1);
   
    for(i=0;i<Room.chair_data.length;i++){
        Room.chair_data[i].children[1].innerHTML="-";
    }
   for(var i=0; i< memberdata.length-1; i++){
       use_desk_element[i].childNodes[3].innerHTML=memberdata[i+1][1];
   }
    document.getElementById('drop_area_wrap').style.display="none";
}

//--------------------------　ドラッグドロップ　直Inputの場合----------------------------
//Inputがないとできないので制約がある
var element = document.getElementById("drop-zone2");
element.style.boxSizing="border-box";
element.addEventListener("dragover", function (e) {
    e.target.style.border="Solid 10px #cc2222";
});
element.addEventListener("dragleave", function (e) {
    e.target.style.border="none";
});
//Input にファイルが入った検出はchange
var a = element.addEventListener("change", function (e) {  
    e.target.style.border="none";
    var file = element.files;       //ファイルデータ読み込み input ver
    if (type_inspection(file)) {　　　//ファイルインスペクション　呼び出しと判定
        encode_error_check(file);
    }
    element.value = "";
}, false);

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
    for (var i = 0; i < members_e.length; ++i) {  //空配列削除
        if (members_e[i].length != 1){
            members.push(members_e[i]);
        }
    }
    Students = new students_data(members);
    select_option_set(members);
}
//CSVデータからソート順の選択肢をHTMLとして追加
function select_option_set(m_list){
    Elemant_sort_sel.innerHTML=""
    Elemant_sort_sel.insertAdjacentHTML('beforeend', '<option value="rand">ランダム順</option>');
    for(var t=0;t<m_list[1].length;t++){
        Elemant_sort_sel.insertAdjacentHTML('beforeend', '<option value='+t+'">'+m_list[0][t]+'</option>');
    }   
    if(set_onchanger()){
        Element_arrange_set.style.display="inline-block";
    }
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
    }
    return result;
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