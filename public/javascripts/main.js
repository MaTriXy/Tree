requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min'
    }
});


// Load the application.
require(
[
    "jquery", 
    "utils", 
    "api", 
    "graph"
], 
function($, Utils, Api, Graph) {

    var utils = Utils();
    if(utils.isTouchDevice()) {
        // don't show the graph on touchable devices
        window.location = "/";
        return;
    }

    var graph = new Graph();

    var userListEl, searchInputEl;

    $(function() {

        // init dom elements
        userListEl = $("#user-list");
        searchInputEl = $("#search-input");
        toggleAnimEl = $("#toggle-animation")

        // init graph
        graph.init();

        // init events
        $("#search-btn").on("click", getUser);

        searchInputEl.on("keypress", function(e) {
            if((e.keyCode || e.which) == 13) {
                getUser();
            }
        });

        userListEl.find("li a.delete").live("click", function() {
            deleteUser($(this).closest("li"));
        });

        toggleAnimEl.on("click", function() {
            toggleAnimation($(this).is(':checked'));
        });

        toggleAnimEl.prop("checked", true);

    });

    function getUser() {
        var username = "@" + $("#search-input").val();
        Api.getUser(username, addUser);
    }

    function addUser(data) {
        if(!graph.hasCentralNode(data.userid)) {
            graph.add(data.userid, data.username, data.followers);

            userListEl.append(
            ($("<li></li>").attr("data-user-id", data.userid)).append($("<a class='delete'>&times;</a>")).append($("<span></span>").text("@" + data.username)));
        }

        searchInputEl.val("");
    }

    function deleteUser(li) {
        li.remove();
        graph.drop(li.attr("data-user-id"));
    }

    function toggleAnimation(flag) {
        graph.toggleAnimation(flag);
    }

});