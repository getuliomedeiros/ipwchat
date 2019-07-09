let auth = firebase.auth();
let db = firebase.firestore();

function createChat(id, t) {
  let li = document.createElement("li");
  li.innerText = t.createIn.toDate('dd/mm hh:ii') + " - " + t.userMenssager + ": " + t.title;
  
  status.value = t.status;

  status.onchange = function(evt) {
    db.collection("chat").doc(id).update({ status: evt.target.value });
  }
  return li;
}

window.onload = function() {
  let chatInput = document.getElementById("conversation");
  let btnAdd = document.getElementById("btnAdd");
  
  btnAdd.onclick = function() {
    let chat = {
      userMenssager: user.displayName.value,
      createIn: new Date(),
      title: chatInput.value
    };

    db.collection("chat").add(chat).then(function(doc) {
      console.log("chat add:", doc.id);
    });
  }

  db.collection("chat").onSnapshot(function(collectionChat) {
    
    let list = document.getElementById("chat");
    list.innerText = "";

    for (let doc of collectionChat.docs) {
      list.appendChild(createChat(doc.id, doc.data()));
    }
  });

  auth.onAuthStateChanged(function(user) {
    if (user) {
      let textUser = document.getElementById('user');
      let btn = document.getElementById('disconnect');
      textUser.innerHTML = "User connected: " + user.displayName;
      btn.addEventListener('click', function() {
        firebase.auth().signOut().then(function() {
          console.log("You are offline");
        });
      });
    } else {
      window.location.replace('index.html');
    }
  });
}