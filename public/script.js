$(document).ready(function() {
    $("#myInput").on("keyup", function() {
        var value = $(this)
            .val()
            .toLowerCase();
        $("#myTable .inputs").filter(function() {
            $(this).toggle(
                $(this)
                    .text()
                    .toLowerCase()
                    .indexOf(value) > -1
            );
        });
    });
});

$(".delete-before").click(function() {
    $(".sure").removeClass("none");
    $(".delete-after").removeClass("none");
    $(".delete-before").addClass("none");
});

$("#myTable tr").click(function() {
    $(this)
        .addClass("selected")
        .siblings()
        .removeClass("selected");
    var value = $(this)
        .find("tr")
        .html();
    // $("#myTable td").wrapInner('<div class="selected"></div>');
});
