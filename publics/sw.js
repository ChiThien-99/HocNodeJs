self.addEventListener("push",(event)=>{
    let data={title:"Thông báo mới",body:"Bạn có công việc cần xử lý!"};
    if (event.data) {
        try {
            data=event.data.json();
        } catch (error) {
            data.body=event.data.text();
        }
    }
    const options={
        body:data.body,
        icon:data.icon||"/img/logo_imzai_1.png",
        badge:"/img/logo_imzai_1.png",
        vibrate:[200,100,200],
        data:{url:"/dashboard"},
    };
    event.waitUntil(self.registration.showNotification(data.title,options))
});
self.addEventListener("notificationclick",(event)=>{
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url))
});