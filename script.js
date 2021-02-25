"use strict";

// const firstName = document.querySelector(".firstname");
const filterHouse = document.querySelector("#filterConteiner");
const filterName = document.querySelector(".sort");
const searchField = document.querySelector("#searchByName");
const mainInfo = document.querySelector("#main-info");
const eachHouse = document.querySelector(".each-house");
let prefectsInTheHouses = {
  gryffindor: [],
  hufflepuff: [],
  slytherin: [],
  ravenclaw: [],
};
let inputValueLength = null;
let filteredList = null;
let familyList = null;
let studentList = null;
let displayStudentList = null;
let expelledStudents = [];
let listSortedBy = "firstName";

function start() {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return createList(data);
    });
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      recivedData(data);
      getNumberOfStudents();
    });
}
const createList = (data) => {
  familyList = data;
};
const clearHtmlList = () => {
  const myNode = document.getElementById("list");
  while (myNode.lastElementChild) {
    if (myNode.lastElementChild.id === "studentTemplate") {
      break;
    }
    myNode.removeChild(myNode.lastElementChild);
  }
  getNumberOfStudents();
};
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

const recivedData = (allStudents) => {
  studentList = allStudents.map((student) => createStudentObject(student));
  console.log(studentList);
  console.log(familyList);
  studentList = studentList.map((student) => {
    if (familyList.pure.includes(student.lastName)) {
      return { ...student, bloodType: "pure" };
    } else if (
      familyList.pure.includes(student.lastName) === false &&
      familyList.half.includes(student.lastName) === false
    ) {
      return { ...student, bloodType: "muggle" };
    } else {
      return { ...student, bloodType: "half" };
    }
  });
  filteredList = studentList;
  displayStudentList = studentList;
  studentList.forEach(showStudent);
  filterHouses();
  sortingNames();
  searchStudent();
};

const checkIfImageExists = (imageName, firstName, lastName) => {
  let image = new Image();
  let url_image = `./images/${imageName}.png`;
  image.src = url_image;

  if (image.height === 0) {
    return (imageName = `${lastName.toLowerCase()}_${firstName.toLowerCase()}`);
  } else {
    return imageName;
  }
};

const sortBy = (students, sortBy) => {
  if (sortBy === "firstName") {
    return students.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortBy === "lastName") {
    const noLastName = students.filter(
      (student) => student.lastName === undefined
    );
    let withLastName = students
      .filter((student) => student.lastName !== undefined)
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
    if (noLastName.length) {
      withLastName.push(noLastName[0]);
    }
    return withLastName;
  } else {
    return filteredList;
  }
};

const sortingNames = () => {
  filterName.addEventListener("change", (event) => {
    const value = event.target.value;
    console.log(value);

    if (displayStudentList === null) {
      displayStudentList = sortBy(studentList, value);
    } else {
      displayStudentList = sortBy(displayStudentList, value);
    }
    console.log(displayStudentList);
    listSortedBy = value;
    clearHtmlList();

    displayStudentList.forEach(showStudent);
  });
};

const filterHouses = () => {
  filterHouse.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
      return;
    }
    displayStudentList = filterStudentListByHouses(event.target.textContent);
    console.log(displayStudentList);
    clearHtmlList();
    filteredList = displayStudentList;
    displayStudentList.forEach(showStudent);
  });
};

const searchStudent = () => {
  searchField.addEventListener("input", (event) => {
    const inputValue = event.target.value;
    if (inputValueLength > event.target.value.length) {
      displayStudentList = filteredList || studentList;
    }
    inputValueLength = event.target.value.length;
    if (displayStudentList === null || !displayStudentList.length) {
      let filteredByFirstname = studentList.filter((student) =>
        student.firstName.toLowerCase().includes(inputValue)
      );
      let filteredByLastName = studentList.filter((student) => {
        if (student.lastName === undefined) {
          return false;
        }
        return student.lastName.toLowerCase().includes(inputValue);
      });
      displayStudentList = getUniqueListBy(
        filteredByFirstname.concat(filteredByLastName),
        "firstName"
      );
      clearHtmlList();
      sortBy(displayStudentList, listSortedBy).forEach(showStudent);
    } else {
      let filteredByFirstname = displayStudentList.filter((student) =>
        student.firstName.toLowerCase().includes(inputValue)
      );
      let filteredByLastName = displayStudentList.filter((student) => {
        if (student.lastName === undefined) {
          return false;
        }
        return student.lastName.toLowerCase().includes(inputValue);
      });
      displayStudentList = getUniqueListBy(
        filteredByFirstname.concat(filteredByLastName),
        "firstName"
      );

      clearHtmlList();
      const sortTest = sortBy(displayStudentList, listSortedBy);
      sortTest.forEach(showStudent);
      console.log(sortTest);
    }
    console.log(inputValue);
  });
};
//display main informations about the list
const getNumberOfStudents = () => {
  mainInfo.querySelector(".total-num").textContent = studentList.length;
  mainInfo.querySelector(".expel-stud").textContent = expelledStudents.length;
  mainInfo.querySelector(".displayed").textContent = displayStudentList.length;

  //houses
  for (let i = 0; i < eachHouse.children.length; i++) {
    let houseElem = eachHouse.children[i];
    let studentsInTheHouse = studentList.filter((elem) => {
      return elem.house.toLowerCase() === houseElem.className;
    });
    houseElem.textContent = studentsInTheHouse.length;
  }
};

const filterStudentListByHouses = (house) => {
  if (house === "All students") {
    return studentList;
  }
  const newStudentList = studentList.filter((student) => {
    return student.house === house;
  });
  return newStudentList;
};

function addPrefect() {
  console.log(this);
  let house = this.parentNode.children[6].textContent.toLowerCase();
  let gender = this.parentNode.children[5].textContent;
  let firstName = this.parentNode.children[1].textContent;
  let potentialPrefect = studentList.filter((prefect) => {
    return prefect.firstName === firstName;
  });
  let prefectCheck = prefectsInTheHouses[house].filter((prefect) => {
    return prefect.firstName === firstName;
  });
  console.log(prefectsInTheHouses);
  if (prefectCheck.length > 0) {
    prefectsInTheHouses[house] = prefectsInTheHouses[house].filter(
      (prefect) => {
        return prefect.firstName !== firstName;
      }
    );
    console.log(prefectsInTheHouses[house]);
    return;
  }

  if (prefectsInTheHouses[house].length === 2) {
    return;
  } else if (prefectsInTheHouses[house].length === 1) {
    if (prefectsInTheHouses[house][0].gender === gender) {
      return;
    } else {
      prefectsInTheHouses[house].push(potentialPrefect[0]);
    }
  } else {
    prefectsInTheHouses[house].push(potentialPrefect[0]);
  }
  console.log(prefectsInTheHouses);
}

function showStudent(oneStudent) {
  const parent = document.querySelector("template#studentTemplate").content;
  const myCopy = parent.cloneNode(true);

  const targetStudentImage = () => {
    let firstName = oneStudent.firstName;
    let lastName = oneStudent.lastName;
    if (lastName === undefined) {
      return;
    }
    if (lastName.includes("-")) {
      lastName = lastName.split("-")[1];
    }
    let imageName = `${lastName.toLowerCase()}_${firstName[0].toLowerCase()}`;
    imageName = checkIfImageExists(imageName, firstName, lastName);
    return (myCopy.querySelector(".picture").src = `./images/${imageName}.png`);
  };

  myCopy.querySelector(".firstname").textContent = oneStudent.firstName;
  myCopy.querySelector(".middlename").textContent = oneStudent.middleName;
  myCopy.querySelector(".nickname").textContent = oneStudent.nickName;
  myCopy.querySelector(".lastname").textContent = oneStudent.lastName;
  myCopy.querySelector(".gender").textContent = oneStudent.gender;
  myCopy.querySelector(".prefect").addEventListener("change", addPrefect);
  myCopy.querySelector(".expell").addEventListener("click", function () {
    console.log(this.parentNode.children[1]);
    const firstnameOfElement = this.parentNode.children[1].textContent;
    const newStudentList = studentList.filter((student) => {
      return student.firstName !== firstnameOfElement;
    });
    const expelledStudent = studentList.filter((student) => {
      return student.firstName === firstnameOfElement;
    });
    const newFilteredList = filteredList.filter((student) => {
      return student.firstName !== firstnameOfElement;
    });
    const newDisplayedList = displayStudentList.filter((student) => {
      return student.firstName !== firstnameOfElement;
    });
    clearHtmlList();
    studentList = newStudentList;
    filteredList = newFilteredList;
    displayStudentList = newDisplayedList;
    expelledStudents.push(expelledStudent[0]);
    displayStudentList.forEach(showStudent);
  });

  targetStudentImage();

  myCopy.querySelector(".house").textContent = oneStudent.house;

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
    gender: "",
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
      secondWord = secondWord.slice(1, secondWord.length - 1);
      StudentObject.nickName = capitalization(secondWord);
    } else {
      StudentObject.middleName = capitalization(secondWord);
    }
  } else {
    //last name
    StudentObject.lastName = secondWord && capitalization(secondWord);
  }
  StudentObject.gender = student.gender;

  return StudentObject;
};

document.addEventListener("DOMContentLoaded", start);
