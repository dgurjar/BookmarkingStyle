var tem;
window.onload = function(){
    /* Get saved bookmarks from storage */
    chrome.storage.local.get("bookmarks", function(items){
        console.log(items);
        tem = items;
        if(items.bookmarks){
            $('body').append(JSON.stringify(items));
        }
    });
}

