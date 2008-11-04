function showDetail(eq_id) {
	var displacement = $("#event_displacement_" + eq_id);
	var detail = $("#event_detail_" + eq_id);
	var display = displacement.css("display");
	if (display == "none") {
		displacement.attr("style", "");
		detail.animate({ height :"200px" },"fast", "linear");
	}
	else {
		detail.animate(
			{height :"0px" },
			"fast", "linear", function() {
				displacement.attr("style", "display: none");
			}
		);
	}
}

function updateStatus(a_eq_id, status) {
	var imagePath = null;
	var imageTooltip = null;
	if (status == 1) {
		imagePath = "/images/icon_star_empty.gif";
		imageTooltip = "Mark as new";
		$("#event_status_text_" + a_eq_id).html(
				"<b><font color='#0000FF'>Done</font></b>");
	} else {
		imagePath = "/images/icon_star_full.gif";
		imageTooltip = "Mark as done";
		$("#event_status_text_" + a_eq_id).html(
				"<b><font color='#FF0000'>New</font></b>");
	}
	$("#event_status_" + a_eq_id + " > img").attr("title", imageTooltip);
	$("#event_status_" + a_eq_id + " > img").attr("src", imagePath);
}

function changeStatus(a_eq_id) {
	$("#event_status_" + a_eq_id + " > img").attr("src", "/images/throbber.gif");
	$.ajax( {
		type: "POST",
		dataType: "json",
		url: "/event/changestatus/",
		data: {
			a_eq_id: a_eq_id, 
		},
		success : function(response) {
			updateStatus(a_eq_id, response.status);
		}
	});
}

function openUpdateForm(eq_id, a_eq_id) {
	antelope_eq_id = a_eq_id;
	event_eq_id = eq_id;
	$("#event_alert").attr("src", "/event/alert/id/" + eq_id);
	inputForm.dialog("open");
}

function updateEvent() {
	$("#event_status_" + antelope_eq_id + " > img").attr("src", "/images/throbber.gif");
	$.ajax( {
		type :"GET",
		dataType :"json",
		url :"/event/getstatus/id/" + antelope_eq_id,
		success : function(response) {
			updateStatus(antelope_eq_id, response.status);
			$($("#event_" + antelope_eq_id).children().get(5)).html(response.alerts);
		}
	});
	
	var randomNumber = Math.floor(Math.random() * 99999999);
	$("#event_detail_" + event_eq_id).attr("src",
			"/event/detail/id/" + antelope_eq_id + "?_=" + randomNumber);
}

function appendEvent(node, event) {
	// Add event
	event_node = $("#dummy_event").clone();
	event_node.insertAfter($(node));
	event_node.attr("id", "event_" + event.a_eq_id);

	$(event_node).find("#dummy_event_status").click( function() {
		changeStatus(event.a_eq_id);
		return false;
	});
	$(event_node).find("#dummy_event_view").click( function() {
		showDetail(event.eq_id);
		return false;
	});
	$(event_node).find("#dummy_event_update").click( function() {
		openUpdateForm(event.eq_id, event.a_eq_id);
		return false;
	});

	$(event_node).find("#dummy_event_status_text").attr("id",
			"event_status_text_" + event.a_eq_id);
	$(event_node).find("#dummy_event_status").attr("id",
			"event_status_" + event.a_eq_id);
	$(event_node).find("#dummy_event_view").attr("id",
			"event_view_" + event.eq_id);
	$(event_node).find("#dummy_event_update").attr("id",
			"event_update_" + event.eq_id);

	// Add displacement node
	var displacement_node = $("#dummy_event_displacement").clone();
	displacement_node.insertAfter(event_node);
	displacement_node.attr("id", "event_displacement_" + event.eq_id);

	var iframe_node = $(displacement_node).find("#dummy_event_detail");
	iframe_node.attr("id", "event_detail_" + event.eq_id);
	iframe_node.attr("src", "/event/detail/id/" + event.a_eq_id);

	// Update other values and show the event on event table
	updateStatus(event.a_eq_id, event.status);
	if (event.type) {
		$(event_node.children().get(2)).html("Tsunami");
	} else {
		$(event_node.children().get(2)).html("Earthquake");
	}
	$(event_node.children().get(3)).html(event.a_eq_id);
	$(event_node.children().get(4)).html(event.serial);
	$(event_node.children().get(5)).html(event.alerts);
	$(event_node.children().get(6)).html(event.time);
	$(event_node.children().get(7)).html(event.magnitude);

	$(event_node).animate({ opacity: "show" }, "slow", "swing");
}

function putEvent(event) {
	var child = $("#event_" + event.a_eq_id);
	if (child.length > 0) {
		prevNode = child.prev();
		removeEvent(child);
		appendEvent(prevNode, event);
		return;
	}
	appendEvent($("#dummy_event_displacement"), event);
}

function addEvent() {
	var event = new Object();
	event.eq_id = 101;
	event.status = 0;
	event.a_eq_id = 2;
	event.alerts = 20;
	event.time = "10/11/2002";
	event.magnitude = "10";
	putEvent(event);
}

function removeEvent(child) {
	child.fadeOut("slow", function() {
		child.next().remove();
		child.remove();
	});
}

function removeEvents() {
	var row = 6 + 2 * 15;
	var children = $("#events > tbody > tr");
	var length = children.length;
	while (length >= row) {
		child = children.get(length - 3);
		removeEvent($(child));
		length -= 2;
	}
}

function getTopEvents() {
	getEvents(true);
}

/*
 * Get events and populate to event list table
 * 
 * @top: pass "top" to retrieve top events, otherwise, a list of events will be
 * returned
 */
function getEvents(top) {
	if (isWaitingForResponse) {
		return;
	}
	isWaitingForResponse = true;

	var url = "/event/events/";
	if (top) {
		url += "top/";
	}
	$.ajax( {
		type :"GET",
		url :url,
		cache :false,
		dataType :"json",
		success : function(json) {
			$.each(json.events, function(i, event) {
				if (event != "undefined") {
					putEvent(event);
				}
			});
			removeEvents();
		},
		complete : function(json) {
			isWaitingForResponse = false;
			setTimeout(getTopEvents, 5000);
		}
	});
}

$(document).ready( function() {
	isWaitingForResponse = false;
	getEvents();
});