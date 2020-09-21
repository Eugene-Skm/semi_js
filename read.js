/*------------------------description-------------------------------------- */
//HTML編集時は各所（5-10個）にあるgetByElementId()に注意する
//HTML側は部屋を形成するWrapper部分、ドロップゾーン部分に　id　が必要
//Table型Room未対応
//CSV読み込みは　Sjis型
/* 主要部分
        事前準備
        HTML onload > basicscription() > grid_id_set()　（グリッドの場合）
                                    > room_checker() > grid_id_set()　（テーブルの場合）

        ドラドロ検出(イベントリスナーにて) > make_csv()　> HTML　セッティング表示
        セッティング　input 値の変化　set_onchanger() (設定と机の必要数の比較　>エラー検出（人数に対する机不足）)
        
        最終出力
        セッティング　submit > name_set() 

    その他ファンクション
        get_tagName(), get_element_style()
        drag_Effect_on(), drag_Effect_off()
        type_inspection(), encode_error_check()
        select_option_set(), list_sort()
*/
/*------------------------description-------------------------------------- */

/* ---挿入されるHTML要素のElement取得用事前変数--*/
var first_load=0;
var Elemant_sort_sel,Element_set_way,Element_pitch,Element_arrange_set,Element_sort_dir;
var Element_room=document.getElementById('room');
var alpha_bet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U"];
var odd_alpha_bet =["A","C","E","G","I","K","M","O","Q","S","U"];
var even_alpha_bet =["B","D","F","H","J","L","N","P","R","T","V"];
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
    if(get_element_style(Element_room).display=="grid"){
        grid_id_set();　//座席へのIDセット
    }else{
        room_checker();
    }
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
    var[dsk_sum,cos,ros,rc,cc]=room_checker();
    var deskfig;
    var pitch=parseInt(Element_pitch.value);
    var error_flg=0;
    var sitemens;
    if(Element_set_way.value=="chair"){
        deskfig=(pitch + 1) * (members.length-1)-pitch;
        if(deskfig>dsk_sum && pitch==1) error_flg=1;
    }else if(Element_set_way.value=="cols"){
    sitemens=0;
        
        for(var g=0;g<cc.length;g+=pitch+1){
            sitemens+=cc[g];
        }
    }else if(Element_set_way.value=="check"){
        sitemens=0;

        for(var f=0;f<rc.length;f++){
            var start=(cos-rc[f])/2
            var end=start+rc[f]-1;
            if(f%2==0){     //市松模様のため　行ごとに使用アルファベットを変更
                use_char=even_alpha_bet;
            }else{
                use_char=odd_alpha_bet;
            }
            for(var w=start;w<=end;w++){
                for(var q=0;q<use_char.length;q++){
                    if(alpha_bet[w]==use_char[q]){
                        sitemens++;
                    }
                }
            }
        }
        
    }
    console.log("needdesk",deskfig);
    console.log("desknum",dsk_sum);
    console.log("sitemems",sitemens);
    console.log("member",members.length-1);

    if((deskfig>dsk_sum&&error_flg==0)||sitemens<members.length-1){
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
function grid_id_set(){　//座席へのIDセット (grid)
    var desks = Element_room.children;
    room_id_list=[];
    var[dsck_num,cols,rows]=room_checker();
    var desk_number=0;
    for(var rl=1; rl<= rows;rl++){
        for(var cl=0; cl< cols; cl++){
            if(desks[desk_number]){
                var this_id=(alpha_bet[cl]+"-"+(( '00' + rl ).slice( -2 )));
                desks[desk_number].id=this_id;
                desks[desk_number].childNodes[1].innerHTML=this_id;
                if(get_element_style(desks[desk_number]).visibility!="hidden"){
                    room_id_list.push(this_id);             //部屋に存在するつくえのidを事前にリスト化
                }
                desk_number++;
            };
        }
    }
}
function table_id_set(row_c, row_cols,max_rows_c){　　//id　セット　テーブルの場合 
    var rn=1;
    room_id_list=[];

    for(var o=1;o<Element_room.childNodes[1].childElementCount*2;o+=2){
        var this_row_c=Element_room.childNodes[1].childNodes[o].childElementCount;
        var start=1;
        if(this_row_c<max_rows_c){      //その行の机の数が最大値ではない場合　（最大数行あたり10席教室の　前方席など）
            start=(max_rows_c-this_row_c)/2;    //id 割り振りのオフセットを計算
            for(var g=1;g<this_row_c*2;g+=2){
                var this_id=(alpha_bet[start]+"-"+(( '00' + rn ).slice( -2 )));
                Element_room.childNodes[1].childNodes[o].childNodes[g].id=this_id;
                Element_room.childNodes[1].childNodes[o].childNodes[g].childNodes[1].innerHTML=this_id;
                room_id_list.push(this_id);//部屋に存在するつくえのidを事前にリスト化
                start++;
            }
        }else{
            for(var g=1;g<max_rows_c*2;g+=2){
                var this_id=(alpha_bet[start-1]+"-"+(( '00' + rn ).slice( -2 )));
                Element_room.childNodes[1].childNodes[o].childNodes[g].id=this_id;
                Element_room.childNodes[1].childNodes[o].childNodes[g].childNodes[1].innerHTML=this_id;
                room_id_list.push(this_id);//部屋に存在するつくえのidを事前にリスト化
                start++;
            }
        }
        rn++;
    }
    //Element_room=Element_room.parentNode;
    console.log(room_id_list);
}
function get_element_style(ele){
    return window.getComputedStyle(ele);　
}
function get_tagName(Ele){
    return Ele.tagName;
}

//部屋の行列数チェック　（1601のような規則的な部屋のみ）
var first_flg=0;
function room_checker(){
    tag_type=get_tagName(Element_room);
    var desk_count=0,colm_nums,row_nums,col_consist=[],row_consists=[];
    if (get_element_style(Element_room).display=="grid"){

        //子要素数 (gridの場合　机の総数となる)
        desk_count = Element_room.childElementCount ;
        
        grcolu = get_element_style(Element_room).gridTemplateColumns;　　　//grid のCSS　列数取得　
        //空白でスプリットして結果配列の長さを取得　（教室での列数）
        colm_nums=grcolu.split(" ").length;
        row_nums= Math.ceil(desk_count/colm_nums);　　//行数

        var hiden_desk=0, col_index=0; 
        for(var o=0;o<colm_nums;o++){
            col_consist[o]=0;
        }
        for(var o=0;o<row_nums;o++){
            row_consists[o]=0;
        }
        var r=0;
        for(var u=0; u<desk_count;u++){

            if(get_element_style(Element_room.children[u]).visibility=="hidden"){
                hiden_desk++;
            }else {
                col_consist[col_index]++;
                row_consists[r]++;
            }
            col_index++;
            if(col_index==colm_nums){
                col_index=0;
            }
            if((u+1)%colm_nums==0){
                r++;
            }

        }
        desk_count=desk_count-hiden_desk;
        
        
    }else if(tag_type=="TABLE"){ //さて、、Table タグの場合は？？
        row_nums=Element_room.childNodes[1].childElementCount ;           //机の行数
        var max_row_fig=0;
        for(var p=1;p<Element_room.childNodes[1].childElementCount*2;p+=2){
            var ro_c=Element_room.childNodes[1].childNodes[p].childElementCount;
            row_consists.push(ro_c);　　//前の行から机の数を挿入
            desk_count+=ro_c; 　//机数カウント
            if(ro_c>max_row_fig){
                max_row_fig=ro_c;       //列の最大値を取得
            }
        }
        colm_nums=max_row_fig;

        if(first_flg==0){
            table_id_set(row_nums,row_consists,max_row_fig);
        }
        for(var o=0;o<colm_nums;o++){
            col_consist[o]=0;
        }
        for(var h=0;h<room_id_list.length;h++){
            var ind =alpha_bet.indexOf(room_id_list[h][0])
            col_consist[ind]++;
        }
        
    }
        console.log(col_consist);
        console.log(row_consists);
    return [desk_count, colm_nums, row_nums,row_consists,col_consist]; //結果返却
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
    for (var i = 0; i < members_e.length; ++i) {  //空配列削除
        if (members_e[i].length != 1){
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
    console.log("final_sort_result",result);
    return result;
}

/*------------------出力系--------------------*/
function name_set(){
    Element_arrange_set.style.display="none";

    var memberdata=list_sort(members);
    var classnm = prompt("授業名を入力してください");
    var teachernm = prompt("教員名を入力してください");
    document.getElementById("classdata").innerHTML="授業名："+classnm+"<br>担当教員名："+teachernm+"<br>学生数："+(members.length-1);
    var member_count=1;
    
    var step=parseInt(Element_pitch.value)+1; //座席間隔　デフォルト値2　＝1席おき
    for(i=0;i<room_id_list.length;i++){
        document.getElementById(room_id_list[i]).childNodes[3].innerHTML="-";
    }
    var[dsk_sum,cos,ros,rc]=room_checker();
    /*出力では　その都度利用する列のアルファベットを指定し
    頭文字がそのアルファベットに合致するエレメントに名前を挿入
    */

    if(Element_set_way.value=="chair"){　　 //指定並び順　席間隔
        for(i=0;i<room_id_list.length;i+=step){
            if(memberdata[member_count]){
                document.getElementById(room_id_list[i]).childNodes[3].innerHTML=memberdata[member_count][1];
                member_count++;
            }
        }
    }else if(Element_set_way.value=="cols"){        //指定並び順　列間隔
        var use_char=[];
        var w=0;
        for(var j=0;j<cos;j++){
            use_char.push(alpha_bet[w]);
            w+=step;
        }
        var Mdata;
        for(var t=0;t<room_id_list.length;t++){
            for(var f=0;f<use_char.length;f++){
                if(room_id_list[t][0]==use_char[f]){        //リスト化された部屋のIDから　アルファベットに合致するIDを検索
                    if(memberdata[member_count]){
                        document.getElementById(room_id_list[t]).childNodes[3].innerHTML= memberdata[member_count][1];
                        member_count++;
                        break;
                    }
                }
            }
        }
    }else if(Element_set_way.value=="check"){        //指定並び順　市松模様
        room_list_index=0;
        var b=0;
        var use_char=[];
        var w=0;
        
        for(var t=0;t<room_id_list.length;t++){
            if(parseInt(room_id_list[t][2].toString()+room_id_list[t][3].toString())!=b){
                b++;
                if(b%2==0){     //市松模様のため　行ごとに使用アルファベットを変更
                    use_char=even_alpha_bet;
                }else{
                    use_char=odd_alpha_bet;
                }
            }
            if(parseInt(room_id_list[t][2].toString()+room_id_list[t][3].toString())==b){
                for(var f=0;f<use_char.length;f++){
                    if(room_id_list[t][0]==use_char[f]&&parseInt(room_id_list[t][2].toString()+room_id_list[t][3].toString())==b){
                        if(memberdata[member_count]){
                        document.getElementById(room_id_list[t]).childNodes[3].innerHTML= memberdata[member_count][1];
                        member_count++;
                        }
                    }
                }
            }
        }
    }
}