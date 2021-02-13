"use strict";

// const firstName = document.querySelector(".firstname");

function start() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      dataRecived(data);
    });
}
function dataRecived(allStudents) {
  allStudents.forEach(showStudent);
}

function showStudent(oneStudent) {
  const StudentObject = createStudentObject(oneStudent);
  console.log(StudentObject);
  const parent = document.querySelector("template#studentTemplate").content;
  const myCopy = parent.cloneNode(true);

  const targetStudentImage = () => {
    if (StudentObject.lastName === undefined) {
      return "";
    }
    let imageName = `${StudentObject.lastName.toLowerCase()}_${StudentObject.firstName[0].toLowerCase()}`;
    myCopy.querySelector(".picture").src = `./images/${imageName}.png`;
    console.log(imageName);
    return imageName;
  };

  myCopy.querySelector(".firstname").textContent = StudentObject.firstName;
  myCopy.querySelector(".middlename").textContent = StudentObject.middleName;
  myCopy.querySelector(".nickname").textContent = StudentObject.nickName;
  myCopy.querySelector(".lastname").textContent = StudentObject.lastName;
  // myCopy.querySelector(".picture").src = `./images/${targetStudentImage()}.png`;

  myCopy.querySelector(".house").textContent = StudentObject.house;

  document.querySelector("section#list").appendChild(myCopy);
}

const capitalization = (name) => {
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
};

const createStudentObject = (student) => {
  const StudentObject = {
    firstName: " ",
    middleName: null,
    nickName: null,
    lastName: "",
    house: "",
  };

  const fullName = student.fullname;
  let listOfNames = fullName.split(" ");

  listOfNames = listOfNames.filter((name) => {
    return name !== "";
  });

  const house = student.house;
  let listOfHouses = house.split(" ");

  listOfHouses = listOfHouses.filter((house) => {
    return house !== "";
  });

  //first name
  let firstName = listOfNames[0];
  StudentObject.firstName =
    firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();

  //house
  StudentObject.house = capitalization(listOfHouses[0]);
  //middle name - nickname
  let secondWord = listOfNames[1];

  if (listOfNames.length > 2) {
    StudentObject.lastName = capitalization(listOfNames[2]);
    if (secondWord.match(/"/) !== null) {
      console.log("damian");
      secondWord = secondWord.slice(1, secondWord.length - 1);
      StudentObject.nickName = capitalization(secondWord);
    } else {
      StudentObject.middleName = capitalization(secondWord);
    }
  } else {
    StudentObject.lastName = secondWord && capitalization(secondWord);
  }

  //last name
  return StudentObject;
};

//pictures

document.addEventListener("DOMContentLoaded", start);
