//#region : variables

const postForm = document.querySelector("#post-form");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const body = document.querySelector("#body");
const postList = document.querySelector("#post-list");
const col = document.querySelector(".col-sm-8");

// console.log(col);

//#endregion

//#region : classes & objects

class Post {
  constructor(title, author, body) {
    this.title = title;
    this.author = author;
    this.body = body;
  }
}

class UI {
  addPostToList(post) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <th>${post.title}</th>
        <td>${post.author}</td>
        <td>${post.body}</td>
        <td>
            <i class='bi bi-x fs-5 text-danger delete'></i>
        </td>
    `;

    postList.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.textContent = message;

    col.insertBefore(div, postForm);

    setTimeout(() => div.remove(), 3000);
  }

  clearFields() {
    title.value = "";
    author.value = "";
    body.value = "";
  }

  removePostFromList(row) {
    row.remove();
  }
}

class Store {
  static getPosts() {
    let posts;

    if (localStorage.getItem("posts") === null) {
      posts = [];
    } else {
      posts = JSON.parse(localStorage.getItem("posts"));
    }

    return posts;
  }

  static addPost(post) {
    const posts = this.getPosts();

    posts.push(post);

    localStorage.setItem("posts", JSON.stringify(posts));
  }

  static displayPosts() {
    const posts = Store.getPosts();

    posts.forEach((post) => {
      const ui = new UI();

      ui.addPostToList(post);
    });
  }

  static removePost(title) {
    const posts = this.getPosts();

    posts.forEach((post, index) => {
      if (post.title === title) {
        posts.splice(index, 1);
      }
    });

    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

//#endregion

//#region : functions

const addPost = (e) => {
  e.preventDefault();

  const post = new Post(title.value, author.value, body.value);

  const ui = new UI();

  if (title.value === "" || author.value === "" || body.value === "") {
    ui.showAlert("پر کردن تمام فیلدها الزامی است!", "danger");
  } else {
    ui.addPostToList(post);

    Store.addPost(post);

    ui.showAlert("پست اضافه شد!", "success");

    ui.clearFields();
  }
};

const removePost = (e) => {
  e.preventDefault();

  const ui = new UI();

  if (e.target.classList.contains("delete")) {
    const row = e.target.parentElement.parentElement;
    const title = row.firstElementChild.textContent;

    ui.removePostFromList(row);

    Store.removePost(title);

    ui.showAlert("پست حذف شد!", "warning");
  }
};

//#endregion

//#region : events

postForm.addEventListener("submit", addPost);

postList.addEventListener("click", removePost);

document.addEventListener("DOMContentLoaded", Store.displayPosts);

//#endregion
