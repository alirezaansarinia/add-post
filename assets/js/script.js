//#region : variables
const parentContainer = document.querySelector("#parent-container");
const postForm = parentContainer.querySelector("#post-form");
const title = postForm.querySelector("#title");
const author = postForm.querySelector("#author");
const body = postForm.querySelector("#body");
const list = parentContainer.querySelector("#post-list");
//#endregion

//#region : post

//#region : Post class
class Post {
  constructor(title, author, body) {
    this.title = title;
    this.author = author;
    this.body = body;
  }
}
//#endregion

//#region : UI class
class UI {
  //#region : add post to list
  addPostToList(post) {
    const row = document.createElement("tr");

    row.innerHTML = `
    <th>${post.title}</th>
    <td>${post.author}</td>
    <td>${post.body}</td>
    <td><i class="bi bi-x text-danger fs-3"></i></td>
    `;

    list.appendChild(row);
  }
  //#endregion

  //#region : validation alerts
  showAlert(message, className) {
    //#region : create alert box
    const alertBox = document.createElement("div");
    const textNode = document.createTextNode(message);
    alertBox.appendChild(textNode);
    alertBox.className = `alert alert-${className}`;
    //#endregion

    //#region : alert box position
    parentContainer.insertBefore(alertBox, postForm);
    //#endregion

    //#region : fade after timing out
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
    //#endregion
  }
  //#endregion

  //#region : clear all input fields
  clearFields() {
    title.value = "";
    author.value = "";
    body.value = "";
  }
  //#endregion

  //#region : remove post from list
  removePostFromList(target) {
    target.parentElement.parentElement.remove();
  }
  //#endregion
}
//#endregion

//#region : Local Storage class
class Store {
  //#region : get posts from localStorage
  static getPosts() {
    let posts;

    if (localStorage.getItem("posts") === null) {
      posts = [];
    } else {
      posts = JSON.parse(localStorage.getItem("posts"));
    }

    return posts;
  }
  //#endregion

  //#region : display posts from localStorage into UI
  static displayPosts() {
    const posts = Store.getPosts();

    posts.forEach((post) => {
      //#region : instantiate UI
      const ui = new UI();
      //#endregion

      //#region : add post to list
      ui.addPostToList(post);
      //#endregion
    });
  }
  //#endregion

  //#region : add post to localStorage
  static addPost(post) {
    const posts = Store.getPosts();

    posts.push(post);

    localStorage.setItem("posts", JSON.stringify(posts));
  }
  //#endregion

  //#region : remove post from localStorage
  static removePost(target) {
    //#region : reach to the title of target post
    const tr = target.parentElement.parentElement;
    const title = tr.firstElementChild.textContent;
    //#endregion

    //#region : removing post from localStorage
    const posts = Store.getPosts();

    posts.forEach((post, index) => {
      if (post.title === title) {
        posts.splice(index, 1);
      }
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    //#endregion
  }
  //#endregion
}
//#endregion

//#region : load from localStorage
document.addEventListener("DOMContentLoaded", Store.displayPosts);
//#endregion

//#region : create post
const createPost = (e) => {
  e.preventDefault();

  //#region : instantiate Post
  const post = new Post(title.value, author.value, body.value);
  //#endregion

  //#region : instantiate UI
  const ui = new UI();
  //#endregion

  //#region : validate input values
  if (title.value === "" || author.value === "" || body.value === "") {
    //#region : error alert
    ui.showAlert("لطفا تمامی فیلد ها را پر کنید", "danger");
    //#endregion
  } else {
    //#region : add post to list
    ui.addPostToList(post);
    //#endregion

    //#region : add post to localStorage
    Store.addPost(post);
    //#endregion

    //#region : success alert
    ui.showAlert("پست اضافه شد", "success");
    //#endregion

    //#region : clear input fields
    ui.clearFields();
    //#endregion
  }
  //#endregion
};

postForm.addEventListener("submit", createPost);
//#endregion

//#region : delete post
const deletePost = (e) => {
  //#region : instantiate UI
  const ui = new UI();
  //#endregion

  //#region : post removing
  if (e.target.classList.contains("bi-x")) {
    //#region : remove post from list
    ui.removePostFromList(e.target);
    //#endregion

    //#region : remove post from loaclStorage
    Store.removePost(e.target);
    //#endregion

    //#region : delete alert
    ui.showAlert("پست حذف شد", "warning");
    //#endregion
  }
  //#endregion
};

list.addEventListener("click", deletePost);
//#endregion

//#endregion
