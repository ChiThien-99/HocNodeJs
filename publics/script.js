
    const inpTask=document.getElementById("inpTask");
    const btnTask=document.getElementById("btnTask");
    let idTask=document.getElementById("idTask").innerHTML;
    btnTask.addEventListener("click",()=>{
        const body=JSON.stringify({
            id:0,
            task:inpTask.value,
            complete:false,
        })
        if (idTask) {
            fetch(`/todo/updatetask/${idTask}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json;charset=UTF-8"},
                body,
            })
            .then(res=>res.json())
            .then(({mess,status,error})=>{
                if (status) {
                    alert(mess);
                    window.location.href="/todo";
                } else {
                    alert(`${mess}:${error}`);
                }
            })
            .catch((err)=>{
                alert(`Lỗi kết nối put /todo/updatetask: ${err}`);
            });
        } else {
            fetch("/todo/create",{
            method:"POST",
            headers:{"Content-type":"application/json;charset=UTF-8"},
            body,
        })
        .then(res=>res.json())
        .then((data)=>{
           if(data&&data.id){
            alert("Đã thêm task");
            window.location.href="/todo";
           }else{
            alert("Không thể thêm task");
           }
           
        })
        .catch((err)=>{
            console.error(`Lỗi kết nối post /todo/create ${err}`);
        });
        }
        
    })
    const btnDeletes=document.querySelectorAll(".btnDelete");
    btnDeletes.forEach(btn=>{
        btn.addEventListener("click",(event)=>{
          const id=event.currentTarget.getAttribute("data-id");
          console.log(id);
          fetch(`/todo/delete/${id}`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json;charset=UTF-8"},
          })
          .then(res=>res.json())
          .then(({mess,status,error})=>{
            if(status){
                alert(mess);
                window.location.href="/todo";
            }else{
                alert(mess,error);
            }
          })
          .catch((err)=>{
            console.error(`Lỗi kết nối delete /todo/delete ${err}`)
          });
        })
    })
    const btnComplete=document.querySelectorAll(".btnComplete");
    btnComplete.forEach(btn=>{
      btn.addEventListener("click",(event)=>{
        event.stopPropagation(); //Chặn sự lan truyền lên thẻ cha .item
        const id=event.currentTarget.getAttribute("data-id");
        const btnClick=event.currentTarget;
        console.log(id);
        fetch(`/todo/complete/${id}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json;charset=UTF-8"},
        })
        .then(res=>res.json())
        .then(({mess,status,error})=>{
            if(status){
                alert(mess);
                console.log(event.currentTarget);
                const item=btnClick.closest(".item");
                if(item){
                    item.classList.add("complete");
                }
            }else{
                alert(`${mess}:${error}`);
            }
        })
        .catch((err)=>{
            alert(`Lỗi kết nối put /todo/complete ${err}`);
        });
      })
    })
    const items=document.querySelectorAll(".item");
    items.forEach(item=>{
        item.addEventListener("click",(event)=>{
            if(event.target.classList.contains("btnComplete")) return;
            const id=event.target.getAttribute("data-id");
            fetch(`/todo/updatetask/${id}`,{
                method:"GET",
                headers:{"Content-Type":"application/json;charset=UTF-8"},
            })
            .then(res=>res.json())
            .then((data)=>{
                if (data) {
                    inpTask.value=data.task;
                    btnTask.innerHTML="Cập nhật";
                    idTask=data.id;
                } else {
                    alert("Không thêm được task vào input")
                }
                
            })
            .catch((err)=>{
                alert(`Lỗi kết nối get /todo/updatetask ${err}`)
            });
        })
    })
