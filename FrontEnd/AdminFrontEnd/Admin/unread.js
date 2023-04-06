const box = $(".single-notification-box");
const markAllAsRead = $("#markAllAsRead");
const unreadNotificationNumber = $(".unread-notifications-number");

markAllAsRead.click(function(e){

    console.log("click !");

    if(box.hasClass("unread")){
        box.removeClass("unread");
        box.addClass("read");
        unreadNotificationNumber.text("0");
    }
});


