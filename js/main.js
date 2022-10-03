"use strict";

/**
 * Display answer form.
 */
function answer(e) {
  $(e).closest(".message").find(".make_answer").slideDown();
  return false;
}

/**
 * Converts a string containing a date and time in FR Local time to JS Date object.
 * Example: "05/05/2022 à 16:57"  ==> Javascript datetime object
 * @param {*} str
 * @returns
 */
function stringToDate(str) {
  let date = str.match(/\d{2}\/\d{2}\/\d{4}/gs);
  if (!date) {
    return null;
  }
  date = date[0];
  date = date && date.split("/");
  const day = date[0];
  const month = date[1] - 1;
  const fullYear = date[2];

  let time = str.match(/\d{2}:\d{2}/gs);
  if (!time) {
    return null;
  }
  time = time[0];
  time = time && time.split(":");
  const hour = time[0];
  const minute = time[1];
  return new Date(fullYear, month, day, hour, minute);
} // function stringToDate(str) 

/**
 * Sorts the child messages antichronogically.Most recent one is at the top.
 * @param { HTMLElement }  messageWrapper =>  parent div.message element
 */
function sortChildMessagesByDate(messageWrapper) {
    const childMessages = $(messageWrapper).find(".message-child");
    const sortedMessages = childMessages.sort( (a,b) => {
        const dateA = stringToDate($(a).find(".date").text());
        const dateB = stringToDate($(b).find(".date").text());
        return dateB - dateA;
    });
    $(messageWrapper).find(".message-parent").prepend(sortedMessages);
} // function sortByDateChildMessages()



/**
 * Sorts the parent messages antichronogically.Most recent one is at the top.
 * @param { boolean } shouldSortChildren Child messages should also be sorted or not?
 */
function sortParentMessagesByDate(shouldSortChildren = true) {
    const messages = $(".card-box > .message");
    const sortedMessages = messages.sort(function(a, b) {
        const dateA = stringToDate( $(a).find(".message-parent .date").text() );
        const dateB = stringToDate( $(b).find(".message-parent .date").text() );
        return dateB - dateA;
    });
    $(".card-box").append(sortedMessages);
    if (shouldSortChildren) {
        messages.each( (index, message) => sortChildMessagesByDate(message) );
    }
} // function sortByDateParentMessages(cardBox)

function updateButtonStates(){
    $(".action-read").each( (index, readButton) => {
        const buttonContent = $(readButton).text().trim().toUpperCase();
        if (buttonContent === "MESSAGE LU") {
            $(readButton).text("Message non lu");
            $(readButton).addClass("state-unread");
            $(readButton).removeClass("state-read");
        }else if (buttonContent === "MESSAGE NON LU"){
            $(readButton).text("Message lu");
            $(readButton).addClass("state-read");
            $(readButton).removeClass("state-unread");
        }else{
            console.warn("Unexpected text content in action-read button :" + $(readButton).text());
        }
    });

    $(".action-task").each( (index, taskButton) => {
        const buttonContent = $(taskButton).text().trim().toUpperCase();
        if (buttonContent === "A FAIRE") {
            $(taskButton).text("Fait");
            $(taskButton).addClass("state-done");
            $(taskButton).removeClass("state-undone");
        }else if (buttonContent === "FAIT"){
            $(taskButton).text("A FAIRE");
            $(taskButton).addClass("state-undone");
            $(taskButton).removeClass("state-done");
        }else{
            console.warn("Unexpected text content in action-read button :" + $(taskButton).text());
        }
    });
} // function updateButtonStates()


//**************************************/
// MAIN FUNCTION
//**************************************/
$(document).ready(function () {
  // Fill empty images with default image.
  $("img[src='']").attr("src", "./img/default-profile-image.jpg");


  sortParentMessagesByDate(); // Sorts also child messages by default.
  updateButtonStates();

  /**
   * Read Action Button State Handling.
   * States ==> "Message lu" , "Message non lu"
   */
  $(".action-read").click(function () {
    const buttonContent = $(this).text().trim().toUpperCase();
    if (buttonContent === "MESSAGE LU") {
      $(this).text("Message non lu");
      $(this).addClass("state-unread");
      $(this).removeClass("state-read");
    } else if (buttonContent === "MESSAGE NON LU") {
      $(this).text("Message lu");
      $(this).addClass("state-read");
      $(this).removeClass("state-unread");
    } else {
      console.warn(
        "Unexpected text content in action-read button :" + $(this).text()
      );
    }
    return false;
  });

  /**
   * Read Task Button State Handling.
   * States ==> "A faire" , "Fait"
   */
  $(".action-task").click(function () {
    const buttonContent = $(this).text().trim().toUpperCase();
    if (buttonContent === "A FAIRE") {
      $(this).text("Fait");
      $(this).addClass("state-done");
      $(this).removeClass("state-undone");
    } else if (buttonContent === "FAIT") {
      $(this).text("A faire");
      $(this).addClass("state-undone");
      $(this).removeClass("state-done");
    } else {
      console.warn(
        "Unexpected text content in action-read button :" + $(this).text()
      );
    }
    return false;
  });

  /**
   * Delete whole message block (parents + children)
   */
  $(".action-delete").click(function () {
    if (confirm("Voulez-vous vraiment supprimer ce message?")) {
      $(this).closest(".message").remove();
    }
    return false; // Prevent redirection
  });



}); // $(document).ready(function() {
