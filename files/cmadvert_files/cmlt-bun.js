var selectedAdsCount=0;var selectedOrgsCount=0;var adsNotepad="ads";var orgsNotepad="orgs";var allSelected="allSelected";var partSelected="partSelected";var allUnselected="allUnselected";function notepadSync(){var syncDialog=$("#notepad-sync");if(syncDialog.length>0){syncDialog.dialog({resizable:false,modal:true,width:520,title:"Внимание"});}}function parseNotepadItemsCount(){selectedOrgsCount=parseInt($("span.notepadOrgsCount").html());selectedAdsCount=parseInt($("span.notepadAdsCount").html());}function changeNotepadItemsCount(){var notepadedItemsCount=selectedAdsCount+selectedOrgsCount;$("#notepadCount").html(notepadedItemsCount>0?notepadedItemsCount:"");$("span.notepadAdsCount").html(selectedAdsCount);$("span.notepadOrgsCount").html(selectedOrgsCount);$("#to-notepad").attr("title","Объявлений - "+selectedAdsCount+", организаций - "+selectedOrgsCount);}function decNotepadedCount(type){parseNotepadItemsCount();if(type==adsNotepad){selectedAdsCount--;}else{if(type==orgsNotepad){selectedOrgsCount--;}}changeNotepadItemsCount();}function incNotepadedCount(type){parseNotepadItemsCount();if(type==adsNotepad){selectedAdsCount++;}else{if(type==orgsNotepad){selectedOrgsCount++;}}changeNotepadItemsCount();}function parseResponse(response,message,successCallback,notLoggedUrl,errorCallback){var status=response.status;if(status==100){successCallback();}else{if(status==105){notepadSync();}else{if(status==102){document.location.href=notLoggedUrl;}else{if(status==103){errorCallback(status);}else{if(status==501){$("body").append('<div id="notepad-error-message">На сайте проводятся технические работы. Управление объявлениями, блокнот и личный кабинет заработают 23 ноября примерно в 3 часа утра.</div>');}else{$("body").append('<div id="notepad-error-message">Не удалось '+message+'.<br/>Попробуйте еще раз.<br/>Если ошибка сохраняется, <a href="/webmaster" target="_blank">сообщите нам</a>.</div>');}}var errDialog=$("#notepad-error-message");if(errDialog.length>0){errDialog.dialog({resizable:false,modal:true,width:520,title:"Внимание",buttons:{"Закрыть":function(){$(this).dialog("close");}},close:function(){$(this).remove();}});}}}}}function removeItem(itemID,type,successCallback,currentUrl){$.post("/api-web/profile/notepad/remove",{apiVersion:"2.0.0",id:itemID,type:type,returnURL:currentUrl},function(data){parseResponse(data,"удалить "+(type==adsNotepad?"объявление":"организацию")+" из блокнота",function(){decNotepadedCount(type);successCallback();},"/login?origURL="+encodeURIComponent("/profile/notepad/remove?id="+itemID+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)));},"json");}function addItem(itemID,type,successCallback,currentUrl){$.post("/api-web/profile/notepad/add",{apiVersion:"2.0.0",id:itemID,type:type,returnURL:currentUrl},function(data){parseResponse(data,"добавить "+(type==adsNotepad?"объявление":"организацию")+" в блокнот",function(){incNotepadedCount(type);successCallback();},"/login?origURL="+encodeURIComponent("/profile/notepad/add?id="+itemID+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)));},"json");}function addOrRemoveItem(itemId,itemDiv,itemsNotepadType,currentUrl){if(itemDiv.hasClass("on")){removeItem(itemId,itemsNotepadType,function(){itemDiv.removeClass("on").addClass("off").attr("title","Добавить в блокнот");if(itemsNotepadType==orgsNotepad){$("#org_"+itemId+"_span").html("Добавить в блокнот");}},currentUrl);}else{addItem(itemId,itemsNotepadType,function(){itemDiv.removeClass("hide").removeClass("off").addClass("on").attr("title","Удалить из блокнота");if(itemsNotepadType==orgsNotepad){$("#org_"+itemId+"_span").html("Удалить из блокнота");}},currentUrl);}}function addOrRemoveItemInList(itemId,itemDiv,itemsNotepadType,currentUrl,length){if(itemDiv.hasClass("on")){removeItem(itemId,itemsNotepadType,function(){itemDiv.removeClass("on").addClass("off").attr("title","Добавить в блокнот");$("#notepad_block_link_"+itemId).attr("title","Изменение блокнота Основной");$("#ad_"+itemId+"_notepad_edit").hide();$("#add_to_notepad_in_list_"+itemId).css("display","block");$("#notepad-name-"+itemId).html("Основной");$("#comment_"+itemId).hide();$("#add_comment_"+itemId).show();$("#adComment_"+itemId).attr({"data-ad-status":"","data-ad-comment":"","data-ad-comment-length":length});},currentUrl);}else{addItem(itemId,itemsNotepadType,function(){itemDiv.addClass("on").removeClass("off").removeClass("hide").attr("title","Удалить из блокнота").html("");$("#add_to_notepad_in_list_"+itemId).css("display","none");$("#ad_"+itemId+"_notepad_edit").show();},currentUrl);}}function addItemInList(itemId,currentUrl){addItem(itemId,adsNotepad,function(){$("#ad_"+itemId).addClass("on").removeClass("off").attr("title","Удалить из блокнота").html("");$("#add_to_notepad_in_list_"+itemId).css("display","none");$("#ad_"+itemId+"_notepad_edit").show();$("#notepad_block_link_"+itemId).click();},currentUrl);}function addOrRemAd(adID,currentUrl){addOrRemoveItem(adID,$("#ad_"+adID),adsNotepad,currentUrl);}function addOrRemAdInList(adID,currentUrl,length){addOrRemoveItemInList(adID,$("#ad_"+adID),adsNotepad,currentUrl,length);}function addOrRemOrg(orgID,currentUrl){addOrRemoveItem(orgID,$("#org_"+orgID),orgsNotepad,currentUrl);}function removeAdForTypeViewText(hide_ad,maxCommentLength,currentUrl){var adID=$("#adNotepadBlock").attr("data-ad-id");removeItem(adID,adsNotepad,function(){$("#adNotepadBlock").hide();$("#ad_"+adID+"_notepad_edit").hide();$("#notepad_block_link_"+adID+" .notepad_block_link").html("Основной");$("#adComment_"+adID+" .comment_block_link:first").html("Добавить&nbsp;комментарий").addClass("dotted_link");$("#adComment_"+adID+" .comment_block_link:eq(1)").html("");$("#adComment_"+adID).attr({"data-ad-status":"","data-ad-comment":"","data-ad-comment-length":maxCommentLength});$("#ad_"+adID).show();if(hide_ad){$("#table-an-"+adID).hide();}},currentUrl);}function hideAn(adID,successCallback,currentUrl){$.post("/api-web/profile/notepad/hide",{apiVersion:"2.0.0",id:adID,type:adsNotepad,returnURL:currentUrl},function(data){parseResponse(data,"скрыть объявление",function(){successCallback();},"/login?origURL="+encodeURIComponent("/profile/notepad/hide?id="+adID+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)),function(status){if(status===103){successCallback();}});},"json");}function hideAnForUser(adID,currentUrl){hideAn(adID,function(){$("#anHide").hide();$("#anShow").show();},currentUrl);}function hideAnInList(adID,adH,currentUrl,gaEventLabel){hideAn(adID,function(){var o=$("#to-an-page-"+adID);o.hide();if(!$("div").is("#an-hide-title-"+adID)){o.before('<div id="an-hide-title-'+adID+'" class="an-hide-title'+'">'+'<div class="an-title-hidden">'+adH+'</div><a data-event-type="click" data-ga-category="Блокнот" data-ga-action="Показать объявление - Список объявлений" data-ga-label="'+gaEventLabel+'" id="ad_show_'+adID+'" '+'class="notepad_block_link skryt" '+'style="float:right;" '+'href="javascript:void(0)" '+'onclick="showAnInList('+"'"+adID+"','"+currentUrl+"'"+'); elementTrackEvent(this);" '+'title="Показать объявление">'+'<span class="dotted_link">'+"Показать</span></a>"+'<div style="clear:both;"></div></div>');$("#an-hide-title-"+adID).mouseenter(function(){$(this).find(".skryt").show();}).mouseleave(function(){$(this).find(".skryt").hide();});}},currentUrl);}function showAn(adID,successCallback,currentUrl){$.post("/api-web/profile/notepad/show",{apiVersion:"2.0.0",id:adID,type:adsNotepad,returnURL:currentUrl},function(data){parseResponse(data,"показать объявление",function(){successCallback();},"/login?origURL="+encodeURIComponent("/profile/notepad/show?id="+adID+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)),function(status){if(status===103){successCallback();}});},"json");}function showAnForUser(adID,currentUrl){showAn(adID,function(){$("#anShow").hide();$("#anHide").show();$("#ad_hide_"+adID).show();},currentUrl);}function showAnInList(adID,currentUrl){showAn(adID,function(){$("#an-hide-title-"+adID).remove();$("#to-an-page-"+adID).show();$("#ad_hide_"+adID).show();},currentUrl);}function addToNewNotepad(adID,notepadName,newNotepadNameInput,notepadsListId,maxCnt,noteCnt,currentUrl){var blocknoteCnt=parseInt(noteCnt);if(blocknoteCnt<maxCnt){changeUserNotepad(adID,notepadName,function(){var addNotepad=true;var notepadsList=$("#bloknotes");notepadsList.find("a").each(function(indx,element){if($(element).html()==notepadName){addNotepad=false;}});if(addNotepad){notepadsList.append('<a href="javascript:void(0)" '+'class="blue-with-back" '+'onclick="changeToExistsNotepad('+"$('#adNotepadBlock')"+".attr('data-ad-id'), htmlEncode($(this).html(),'"+currentUrl+"'),"+"'"+notepadsListId+"'"+');">'+notepadName+"</a>");blocknoteCnt=blocknoteCnt+1;}$("#"+newNotepadNameInput).hide();$("#new_bloknote").attr("data-note-cnt",blocknoteCnt);if(blocknoteCnt>=maxCnt){$("#addToNew").hide();}$("#"+notepadsListId).toggle();},currentUrl);}else{alert("Уже создано максимальное количество блокнотов. Для добавления нового блокнота удалите один из существующих.");}}function changeToExistsNotepad(adID,notepadName,notepadsListId,currentUrl){changeUserNotepad(adID,notepadName,function(){$("#"+notepadsListId).toggle();},currentUrl);}function changeUserNotepad(adID,notepadName,successCallback,currentUrl){$.post("/api-web/profile/notepad/change-user-notepad",{apiVersion:"2.0.0",id:adID,operationData:notepadName,type:adsNotepad,returnURL:currentUrl},function(data){parseResponse(data,"переместить объявление",function(){successCallback();$("#notepad_block_link_"+adID).attr("title","Изменение блокнота "+notepadName);$("#ad_"+adID).removeClass("off").removeClass("hide").addClass("on").attr("title","Удалить из блокнота");$("#add_to_notepad_in_list_"+adID).hide();$("#ad_"+adID+"_notepad_edit").show();$("#notepad-name-"+adID).html(notepadName);},"/login?origURL="+encodeURIComponent("/profile/notepad/change-user-notepad?id="+adID+"&operationData="+notepadName+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)));},"json");}function checkComment(comment,maxLength){if(comment.length>maxLength){alert("Длина комментария не должна превышать "+maxLength+" символов.");return false;}else{return true;}}function saveNotepadAdStatusAndCommentInList(adID,comment,status_an,currentUrl,maxLength){if(checkComment(comment,maxLength)){$.post("/api-web/profile/notepad/change-life-state-and-comment",{apiVersion:"2.0.0",id:adID,operationData:comment,newLifeStateName:status_an,type:adsNotepad,returnURL:currentUrl},function(data){var adComment=$("#adComment_"+adID);parseResponse(data,"изменить комментарий объявления",function(){adComment.attr("data-ad-status",status_an);adComment.attr("data-ad-comment",htmlEncode(comment));adComment.attr("data-ad-comment-length",$("#text-length_commentInputId").html());},"/login?origURL="+encodeURIComponent("/profile/notepad/change-life-state-and-comment?id="+adID+"&operationData="+comment+"&newLifeStateName="+status_an+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)),function(status){if(status===103){$("body").append('<div id="notepad-error-message">Длина комментария не должна превышать 200 символов.</div>');}});var status_str=adComment.attr("data-ad-status");var comment_str=adComment.attr("data-ad-comment");if(status_str!=""&&comment_str!=""){status_str=status_str+". ";}if(comment_str!=""){status_str=status_str+comment_str;}if(status_str!=""){$("#add_comment_"+adID).hide();$("#comment_"+adID+" span").html(status_str);$("#comment_"+adID).show();adComment.attr("title","Изменить комментарий").removeClass("add_comment_in_list").removeClass("hide");}else{$("#comment_"+adID).hide();$("#comment_"+adID+" span").html(status_str);$("#add_comment_"+adID).show();adComment.attr("title","Добавить комментарий").addClass("add_comment_in_list").addClass("hide");}$("#editAnBloknoteStatusAndComment").hide();},"json");}}function saveNotepadAdStatusAndComment(adID,comment,status_an,currentUrl,maxLength){if(checkComment(comment,maxLength)){$.post("/api-web/profile/notepad/change-life-state-and-comment",{apiVersion:"2.0.0",id:adID,operationData:comment,newLifeStateName:status_an,type:adsNotepad,returnURL:currentUrl},function(data){var adComment=$("#adComment_"+adID);parseResponse(data,"изменить комментарий объявления",function(){adComment.attr("data-ad-status",status_an);adComment.attr("data-ad-comment",htmlEncode(comment));adComment.attr("data-ad-comment-length",$("#text-length_commentInputId").html());},"/login?origURL="+encodeURIComponent("/profile/notepad/change-life-state-and-comment?id="+adID+"&operationData="+comment+"&newLifeStateName="+status_an+"&type="+adsNotepad+"&returnURL="+encodeURIComponent(currentUrl)),function(status){if(status===103){$("body").append('<div id="notepad-error-message">Длина комментария не должна превышать 200 символов.</div>');}});var status_str=adComment.attr("data-ad-status");var comment_str=adComment.attr("data-ad-comment");if(status_str!=""&&comment_str!=""){status_str=status_str+". ";}if(comment_str!=""){status_str=status_str+comment_str;}if(status_str!=""){adComment.find("span:eq(0)").html("").removeClass("dotted_link");adComment.attr("title","Изменить комментарий");}else{adComment.find("span:eq(0)").html("Добавить&nbsp;комментарий").addClass("dotted_link");adComment.attr("title","Добавить комментарий");}adComment.find("span:eq(1)").html(status_str);$("#editAnBloknoteStatusAndComment").hide();},"json");}}function getSelectionType(){var checked=$(".check_item:checked");return checked.length==0?allUnselected:(checked.length==$(".check_item").length?allSelected:partSelected);}function showNotepadBlock(thisLink,notepad_block){var jTopOffset=thisLink.offset().top+thisLink.height()+3-$("#content").offset().top;var jLeftOffset=thisLink.offset().left-40;notepad_block.css({"top":jTopOffset+"px","left":jLeftOffset+"px"}).toggle();}function checkSpecialsSymbols(input){var value=input.value;var rep=/[<>&]/i;if(rep.test(value)){value=value.replace(rep,"");input.value=value;}}function markCurrentBlocknote(current_name){$("#bloknotes").find("a").each(function(indx,element){if($(element).html()==current_name){$(element).css("font-weight","bold");}else{$(element).css("font-weight","normal");}});}function changeBloknoteInList(thisLink){var notepadBlock=$("#adNotepadBlock");showNotepadBlock(thisLink,notepadBlock);$("#delFromNotepad").show();var adId=thisLink.attr("data-ad-id");notepadBlock.attr("data-ad-id",adId).attr("data-action","");markCurrentBlocknote($("#notepad-name-"+adId).html());}function changeCommentInList(thisLink){var editCommentBlock=$("#editAnBloknoteStatusAndComment");showNotepadBlock(thisLink,editCommentBlock);editCommentBlock.attr("data-ad-id",thisLink.attr("data-ad-id"));$("#life_state_select").val(thisLink.attr("data-ad-status"));$("#commentInputId").attr("placeholder","Комментарий будет виден только вам").attr("value",thisLink.attr("data-ad-comment")).focus();$("#text-length_commentInputId").html(thisLink.attr("data-ad-comment-length"));}$(document).ready(function(){$(document).click(function(e){var target=$(e.target);if(!target.is("#adNotepadBlock")&&target.parents("#adNotepadBlock").size()==0&&!target.is(".notepad_block_link")){$("#adNotepadBlock").hide();}if(!target.is("#editAnBloknoteStatusAndComment")&&target.parents("#editAnBloknoteStatusAndComment").size()==0&&!target.is(".comment_block_link")){$("#editAnBloknoteStatusAndComment").hide();}if(!target.is("#deleteNotepadBlocknote")&&target.parents("#deleteNotepadBlocknote").size()==0&&!target.is(".notepad_block_link_del")){$("#deleteNotepadBlocknote").hide();}if(!target.is("#new_bloknote")&&target.parents("#new_bloknote").size()==0&&!target.is("#create_new_bloknote")){$("#new_bloknote").hide();}if(!target.is("#rename_bloknote")&&target.parents("#rename_bloknote").size()==0&&!target.is("#rename_bloknote_link")){$("#rename_bloknote").hide();}if(!target.is("#changeAnBloknoteStatusAndComment")&&target.parents("#changeAnBloknoteStatusAndComment").size()==0&&!target.is("#change_comment")){$("#changeAnBloknoteStatusAndComment").hide();}if(!target.is("#adPrintNotepadBlock")&&target.parents("#adPrintNotepadBlock").size()==0&&!target.is(".notepad_block_link")){$("#adPrintNotepadBlock").hide();}});$("#notepad_select_all").click(function(){if($(this).is(":checked")){$(this).parent().addClass("all_selected");$(".check_item").attr("checked","checked");$(".notepad_item_content a").removeClass("link_off");}else{$(".check_item").removeAttr("checked");$(this).parent().removeClass("all_selected");$(".notepad_item_content a").addClass("link_off");}});$(".check_item").click(function(){var selectionType=getSelectionType();var elem=$("#notepad_select_all");if(selectionType==allSelected){elem.attr("checked","checked");elem.parent().addClass("all_selected");$(".notepad_item_content a").removeClass("link_off");}else{if(selectionType==allUnselected){elem.removeAttr("checked");elem.parent().removeClass("all_selected");$(".notepad_item_content a").addClass("link_off");}else{elem.parent().removeClass("all_selected");$(".notepad_item_content a").removeClass("link_off");}}});});function declare_package(packageName){var names=packageName.split(".");var curObj=window;for(var i=0;i<names.length;i++){var name=$.trim(names[i]);var newObj=curObj[name]||{};curObj[name]=newObj;curObj=newObj;}}if(typeof Function.isFunction==="undefined"){Function.isFunction=function(arg){return Object.prototype.toString.call(arg)==="[object Function]";};}if(typeof Function.prototype.bind==="undefined"){Function.prototype.bind=function(thisArg){var fn=this,slice=Array.prototype.slice,args=slice.call(arguments,1);return function(){return fn.apply(thisArg,args.concat(slice.call(arguments)));};};}(function($){$.fn.getCaretPosition=function(){var el=$(this).get(0);var pos=0;if("selectionStart" in el){pos=el.selectionStart;}else{if("selection" in document){el.focus();var Sel=document.selection.createRange();var SelLength=document.selection.createRange().text.length;Sel.moveStart("character",-el.value.length);pos=Sel.text.length-SelLength;}}return pos;};$.fn.setCaretPosition=function(pos){if($(this).get(0).setSelectionRange){$(this).get(0).setSelectionRange(pos,pos);}else{if($(this).get(0).createTextRange){var range=$(this).get(0).createTextRange();range.collapse(true);range.moveEnd("character",pos);range.moveStart("character",pos);range.select();}}return this;};$.fn.refresh=function(){return $(this.selector);};}(jQuery));function ToggleBlockVisible(id,elem_style){elem=document.getElementById(id);if(elem.style.display!="none"){elem.style.display="none";}else{if(elem_style==null){elem.style.display="block";}else{elem.style.display=elem_style;}}}function ToggleInlineBlockVisible(id,elem_style){elem=document.getElementById(id);if(elem.style.display!="none"){elem.style.display="none";}else{if(elem_style==null){elem.style.display="inline";}else{elem.style.display=elem_style;}}}function addstar(el){if((typeof window.sidebar=="object")&&(typeof window.sidebar.addPanel=="function")){window.sidebar.addPanel(document.title,location.href,"");}else{if(typeof window.external=="object"){window.external.AddFavorite(location.href,document.title);}else{if(window.opera&&window.print){el.setAttribute("rel","sidebar");el.setAttribute("href",location.href);el.setAttribute("title",document.title);}}}}function getCookie(name){var coo=document.cookie;if(typeof(coo)=="undefined"){return"";}var sp=coo.indexOf(name+"=");if(sp<0){return"";}var ep=coo.indexOf(";",sp);if(ep<0){return coo.substring(sp+name.length+1);}else{return coo.substring(sp+name.length+1,ep);}}function oneM(){return 1000*60;}function oneH(){return 1000*60*60;}function oneY(){return 1000*60*60*24*365;}function setCookie(name,value,expir){if(value.length==0||expir==-1){document.cookie=name+"="+expires(-1)+";path=/;";}else{document.cookie=name+"="+value+expires(expir>=0?expir:oneY())+";path=/;";}}function expires(d){var expiry=new Date();expiry.setTime(expiry.getTime()+d);return"; expires="+expiry.toGMTString();}var defFlash=8;var ie=0,fLatest=0,fz=0,fz2=0,n=navigator;if(n.platform=="Win32"&&n.userAgent.indexOf("Opera")==-1&&n.userAgent.toLowerCase().indexOf("msie")!=-1){ie=1;for(i=3;i<20;i++){var TRKresult=false;document.write("<SCR"+'IPT LANGUAGE=VBScript>\n on error resume next \n TRKresult = IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.'+i+'"))</SCR'+"IPT>\n");if(TRKresult){fLatest=i;}}}if(ie==0&&n.plugins){for(i=0;i<n.plugins.length;i++){if(n.plugins[i].name.indexOf("Flash")>-1){fz=parseInt(n.plugins[i].description.charAt(16));fz2=n.plugins[i].description.charAt(17);if(fz2>="0"&&fz2<="9"){fz=fz*10+parseInt(fz2);}if(fz>fLatest){fLatest=fz;}}}}function flashAvailable(v){return fLatest>=(v==null?defFlash:v);}function insertFlash(v,fl,gif,lnk,w,h,m,p){document.write(getFlashCode(v,fl,gif,lnk,w,h,m,p));}function getFlashCode(v,fl,gif,lnk,w,h,m,p){var d=' width="'+w+'" height="'+h+'"';if(flashAvailable(v)){var pse="";if(!p){p={};}if(!p["quality"]){p["quality"]="high";}if(!p["bgcolor"]){p["bgcolor"]="#FFFFFF";}for(var i in p){pse+=i+'="'+p[i]+'" ';}return'<embed wmode="opaque" class="flash" src='+fl+" "+pse+d+' TYPE="application/x-shockwave-flash" '+'PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></embed>';}else{if(gif!=""){if(lnk!=""){return'<a href="'+lnk+'" target="_blank"><img src="'+gif+'"'+d+' border="0"></a>';}else{return"<img src="+gif+d+">";}}else{if(m!=null){if(m.length>0){m=" "+m;}return'<span class="no_flash">У вас не установлен flash-плеер.'+m+'</span> <a href="http://www.macromedia.com/go/getflashplayer/" target="_blank">Скачать flash-плеер.</a>';}}}return"";}function changeClass(element,styleName){element.className=styleName;}function showMsgDialog(className,destroyOnClose){showCustomDialog("."+className,true,destroyOnClose);}function showFormDialog(className,destroyOnClose){showCustomDialog("."+className,false,destroyOnClose);}function showCustomDialog(selector,closeButton,destroyOnClose,width,title){if(!width){width=520;}if(!title){title="Внимание";}var dialog=$(selector).dialog({autoOpen:false,resizable:false,width:width,modal:true,title:title,open:function(){$(this).find(":input:visible:first").focus();}});if(closeButton){dialog.dialog("option","buttons",{"Закрыть":function(){$(this).dialog("close");}});}if(destroyOnClose){dialog.dialog("option","close",function(){$(this).remove();});}dialog.dialog("open");}function submitAdsForm(selector){var label=$(selector).closest("label");if(label.length!=0&&!label.next("img.load-indicator").length){showLoadingIndicator(label);}else{if(!$(selector+" > img.load-indicator").length){showLoadingIndicator(selector);}}setTimeout(function(){selector.form.submit();},100);}function showLoadingIndicator(selector){selector&&window.loadSpinnerHTML&&$(selector).after(window.loadSpinnerHTML).css("margin-right",0);}function formatPrice(obj){var caretPosition=obj.getCaretPosition();var beforeLength=obj.val().length;var str=obj.val().replace(/\s+/g,"");var formatted=numToPrice(str);obj.val(formatted);obj.setCaretPosition(formatted.length>beforeLength?formatted.length-beforeLength+caretPosition:formatted.length<beforeLength?caretPosition-(beforeLength-formatted.length):caretPosition);return true;}function numToPrice(str){if(!str){return"";}var formatted=str.replace(new RegExp(",","g"),".").replace(new RegExp(" ","g"),"");var thousandsFormatted="";var thousandsCount=0;var thousandsSeparator=" ";var centsVal;if(formatted.split(".").length>1){centsVal=formatted.split(".")[1];}else{centsVal="";}var integerVal=formatted.split(".")[0];if(thousandsSeparator){for(var j=integerVal.length;j>0;j--){var symbol=integerVal.substr(j-1,1);thousandsCount++;if(thousandsCount%3==0){symbol=thousandsSeparator+symbol;}thousandsFormatted=symbol+thousandsFormatted;}if(thousandsFormatted.substr(0,1)==thousandsSeparator){thousandsFormatted=thousandsFormatted.substring(1,thousandsFormatted.length);}var centsDelimiter;if((formatted.split(".").length>1)||formatted.indexOf(".")!=-1){centsDelimiter=".";}else{centsDelimiter="";}}return thousandsFormatted+centsDelimiter+centsVal;}var hintsHelp=[];function showHint(){var hintDiv=$("#hint");var thisLink=$(this);var hintsHelpElement=thisLink.attr("j-hint-text");var jTopOffset=thisLink.offset().top;var jLeftOffset=thisLink.offset().left;var hintWidth=thisLink.attr("j-hint-width");var hintShift=thisLink.attr("j-hint-shift");if(hintWidth==null||hintWidth==""){hintWidth=300;}if(typeof(hintShift)!="undefined"){hintShift=parseFloat(hintShift);}else{hintShift=0;}if(typeof(hintsHelpElement)!="undefined"){hintsHelpElement=thisLink.attr("j-hint-text");if(thisLink.attr("j-hint-align")=="left"){jLeftOffset=jLeftOffset-hintWidth+thisLink.width()-2;}if(thisLink.attr("j-hint-align")=="right"){jLeftOffset=jLeftOffset+thisLink.width()+hintShift+10;jTopOffset=jTopOffset-3;}else{jTopOffset=jTopOffset+thisLink.height()+3;}}else{hintsHelpElement=hintsHelp[thisLink.attr("id")];if(hintsHelp[thisLink.attr("id")+"_hint-align"]=="left"){jLeftOffset=jLeftOffset-hintWidth-50;}else{jLeftOffset=jLeftOffset+thisLink.width()+50;}}if(typeof(hintsHelpElement)!="undefined"){hintDiv.html(hintsHelpElement).css({"top":jTopOffset+"px","left":jLeftOffset+"px","width":hintWidth+"px"}).show();}}function disableButton(id){$("#"+id).attr("disabled","disabled");}function enableButton(id){$("#"+id).removeAttr("disabled");}function validateLength(object,maxLength,disabledId){var text_length_name="text-length_"+$(object).attr("id");$("#"+text_length_name).html("");var len=$(object).val().length;$("#"+text_length_name).html((maxLength-len));if(len<=maxLength){$("#"+text_length_name).addClass("normal_length");$("#"+text_length_name).removeClass("overlong");if(disabledId!="undefined"){enableButton(disabledId);}}else{$("#"+text_length_name).removeClass("normal_length");$("#"+text_length_name).addClass("overlong");if(disabledId!="undefined"){disableButton(disabledId);}}}function hideHint(){$("#hint").html("").hide();}function blockSubmitButton(idForm){$("#"+idForm).on("submit",function(){$("input[type=submit]",this).prop("disabled",true);});}function htmlEncode(value){return value?$("<div/>").text(value).html():"";}function htmlDecode(value){return value?$("<div/>").html(value).text():"";}function loadRubricatorClasses(){$(".header_rubric_link").mouseover(function(){$(this).next().removeClass("other-options-all-off").addClass("other-options-all-h");}).mouseout(function(){$(this).next().removeClass("other-options-all-h").addClass("other-options-all-off");});$(".header_rubric_link_last").mouseover(function(){$(this).next().next().removeClass("other-options-all-off").addClass("other-options-all-h");}).mouseout(function(){$(this).next().next().removeClass("other-options-all-h").addClass("other-options-all-off");});$(".orgs-count-last").mouseover(function(){$(this).next().removeClass("other-options-all-off").addClass("other-options-all-h");}).mouseout(function(){$(this).next().removeClass("other-options-all-h").addClass("other-options-all-off");});}function initRubricOptions(box_id){var otherOptions=$(".other-options-"+box_id);var rubricPopup=$("#rubric_popup_"+box_id);var menuOther=$("#optionsMenuLevel"+box_id);var outOptions=false;var rubricPopupClick=false;rubricPopup.click(function(){if(!rubricPopupClick){$(this).removeClass("other-options-all-off").addClass("other-options-all-on");rubricPopupClick=true;}else{$(this).removeClass("other-options-all-on").addClass("other-options-all-off");rubricPopupClick=false;}menuOther.toggle();});otherOptions.mouseout(function(){outOptions=true;});otherOptions.mouseover(function(){outOptions=false;});$(document).click(function(){if(outOptions){rubricPopup.removeClass("other-options-all-on").addClass("other-options-all-off");rubricPopupClick=false;menuOther.hide();}outOptions=false;});}function logEvent(msg,level,url,line){$.post("/log-event",{level:level,message:msg,url:url,line:line});}window.onerror=function(msg,url,line){logEvent(msg,"error",url,line);return false;};function elementTrackEvent(elem){trackEvent($(elem).attr("data-ga-category"),$(elem).attr("data-ga-action"),$(elem).attr("data-ga-label"));}function trackEvent(category,action,label){if(typeof(ga)==="function"){ga("send","event",category,action,label);}}function trackPageView(hrefAttr){if(typeof(ga)==="function"){ga("send","pageview",hrefAttr);}}function setIframeLinksClick(frames){$.each(frames,function(frameIndex,frame){$(frame).on("load",function(){$.each($(frame).contents().find("a"),function(linkIndex,link){$(link).on("click",function(e){window.parent.trackPageView($(link).attr("href"));});});});});}$(document).ready(function(){$("body").on("keydown keyup focusin",".priceInput",function(e){var $this=$(this),value=$this.val(),key="__savePrice__";(e.type==="keydown"||e.type==="focusin")&&$this.data(key,value);e.type==="keyup"&&$this.data(key)!==value&&formatPrice($this)&&$this.data(key,value);if(!this.getAttribute("maxlength")){return;}!this.getAttribute("original-maxlength")&&this.setAttribute("original-maxlength",this.getAttribute("maxlength"));var originalMaxLength=parseInt(this.getAttribute("original-maxlength")),currentMaxLength=/\./.test(value)?value.split(".")[0].length-1:originalMaxLength;this.setAttribute("maxlength",currentMaxLength>0?originalMaxLength+Math.ceil(currentMaxLength/3)-1:originalMaxLength);});hideHint();$(document).click(function(e){var target=$(e.target);if(!target.is("#hint")&&target.parents("#hint").size()==0&&!target.is(".hint-link")){hideHint();}});$('<div id="hint" style="display:none;"></div>').appendTo("body");$("a.hint-link").click(showHint);$(":input.hint-link").focus(showHint);});function DivPopup(d,movableId,resizable,minH,minW){var o=new PopupWindow(d);o.show=DP_show;o.hide=DP_hide;o.frame=null;if(resizable){$(function(){$("#"+d).resizable({containment:"document",minHeight:minH!=null?minH:10,minWidth:minW!=null?minW:10,handles:"se",start:function(event,ui){$("#"+d+" iframe").hide();},stop:function(event,ui){$("#"+d+" iframe").show();}});});}if(movableId!=null){$(function(){$("#"+d).draggable({handle:"#"+d,containment:"document",start:function(event,ui){$("#"+d+" iframe").hide();},stop:function(event,ui){$("#"+d+" iframe").show();}});});}return o;}function DP_show(link,dx,dy,h,w,frameSrc){this.offsetX=dx;this.offsetY=dy;if(h){$("#"+this.el).css("height",h+"px");}if(w){$("#"+this.el).css("width",w+"px");}if(isHelpBox(this.el)){$("#hbox_quick_help_txt").append('<iframe id="hbox_frame" name="hbox_frame" width="100%" height="100%" frameborder="no" scrolling="no" allowtransparency="true"></iframe>');$("#"+this.el+" iframe").attr("src",frameSrc);}this.showPopup(link);}function DP_hide(){if(isHelpBox(this.el)){$("#"+this.el+" iframe").remove();}document.getElementById(this.el).style.visibility="hidden";if(this.frame!=null){this.frame.style.visibility="hidden";}}function isHelpBox(id){return $("#"+id).hasClass("helpbox");}function PopupWindow(el){this.el=el;this.showPopup=PW_showPopup;this.hide=PW_hidePopup;this.hidePopupWindows=PW_hidePopupWindows;this.isClicked=PW_isClicked;this.closedBy=0;this.shownBy=null;this.offsetX=0;this.offsetY=0;addListener(document,"mousedown",function(e){this.hidePopupWindows(e);}.bind(this));}function addListener(o,e,h){if(typeof o.addEventListener!="undefined"){o.addEventListener(e,h,false);}else{if(typeof o.attachEvent!="undefined"){o.attachEvent("on"+e,h);}}}function removeListener(o,e,h){if(typeof o.removeEventListener!="undefined"){o.removeEventListener(e,h,false);}else{if(typeof o.detachEvent!="undefined"){o.detachEvent("on"+e,h);}}}function AnchorPosition_getPageOffset(e,f){var o=f=="l"?e.offsetLeft:e.offsetTop;while((e=e.offsetParent)!=null){o+=f=="l"?e.offsetLeft:e.offsetTop;}return o;}function getAnchorPosition(a){var c=new Object();var o=document.getElementById(a);c.x=AnchorPosition_getPageOffset(o,"l");c.y=AnchorPosition_getPageOffset(o,"t");return c;}function PW_showPopup(a){if(this.closedBy==1){this.closedBy=0;return false;}this.shownBy=a;var c=getAnchorPosition(a);this.x=c.x+this.offsetX;this.y=c.y+this.offsetY;document.getElementById(this.el).style.left=this.x+"px";document.getElementById(this.el).style.top=this.y+"px";document.getElementById(this.el).style.visibility="visible";return true;}function PW_hidePopupWindows(e){if(!this.isClicked(e)){this.hide();}}function PW_hidePopup(){document.getElementById(this.el).style.visibility="hidden";}function PW_isClicked(e){if(document.getElementById(this.el)==null){return;}if(document.all){var t=window.event.srcElement;while(t.parentElement!=null){if(document.getElementById(this.el).style.visibility!="hidden"&&t.id==this.shownBy){this.closedBy=1;}if(t.id==this.el){return true;}t=t.parentElement;}}else{var t=e.target;while(t.parentNode!=null){if(document.getElementById(this.el).style.visibility!="hidden"&&t.id==this.shownBy){this.closedBy=1;}if(t.id==this.el){return true;}t=t.parentNode;}}return false;}