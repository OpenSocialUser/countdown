var isOwner = false;
var selectedDate = "";

function toJSON(obj) { 
	return gadgets.json.stringify(obj); 
}

function toObject(str) {
    return gadgets.json.parse(str);
}

function updateCountdown() {
	var state = wave.getState();

    var digits = "";
    var targetTime = "";
    var displayCircles = true;

    var digitsRadio = $("input[type='radio'][name='digits']:checked");
    if (digitsRadio.length > 0) {
        digits = digitsRadio.val();
    } else {
        digits = "all";
    }

    targetTime = selectedDate;

    var circlesCheckbox = $("input[type='checkbox'][name='circles']:checked");
    if (circlesCheckbox.length > 0) {
        displayCircles = true;
    } else {
        displayCircles = false;
    }

    circlesColor = $("#picker").val();
    if (circlesColor == null || circlesColor == undefined || circlesColor == "") {
        circlesColor == "40484F";
    }

    if (targetTime != null && targetTime != "") {
        state.submitDelta({'digits' : digits});
        state.submitDelta({'target_time' : targetTime});
        state.submitDelta({'display_circles' : displayCircles});
        state.submitDelta({'circles_color' : circlesColor});

        drawCountdown(digits, targetTime, displayCircles, circlesColor);
    } else {
        renderEditPage();
    }
}

function drawCountdown(digits, targetTime, displayCircles, circlesColor) {    
    var html = "";
    var htmlHeader = "";
    var htmlFooter = "";

    html += "<div id='countdown'></div>";

    if (isOwner) {
        htmlFooter += "<button id='editButton' onclick='renderEditPage()''>Edit</button>";
    }

    document.getElementById('body').innerHTML = html;
    document.getElementById('footer').innerHTML = htmlFooter;
    document.getElementById('header').innerHTML = htmlHeader;

    $("#countdown").data("date", targetTime);

    var showAllDigits = true;

    if (digits != null && digits == "days") {
        showAllDigits = false;
    } else {
        showAllDigits = true;
    }

    $("#countdown").TimeCircles({
        "count_past_zero": false,
        "animation": "smooth",
        "bg_width": 0.2,
        "fg_width": 0.03,
        "circle_bg_color": "#90989F",
        "time": {
            "Days": {
                "text": "Days",
                "color": "#" + circlesColor,
                "show": true
            },
            "Hours": {
                "text": "Hours",
                "color": "#" + circlesColor,
                "show": showAllDigits
            },
            "Minutes": {
                "text": "Minutes",
                "color": "#" + circlesColor,
                "show": showAllDigits
            },
            "Seconds": {
                "text": "Seconds",
                "color": "#" + circlesColor,
                "show": showAllDigits
            }
        }

    });

    if (displayCircles != null && !displayCircles) {
        var canvas = $("#circlesCanvas");
        canvas.hide();

        var timeCirclesDiv = $(".time_circles").first();

        timeCirclesDiv.css("height", canvas[0].height + "px");
    }
}

function checkIfOwner() {
    var userId = null;
    var ownerId = null;

    osapi.people.getViewer().execute(function(data) {
        userId = data.id;
        osapi.people.getOwner().execute(function(data) {
            ownerId = data.id;
            if (ownerId != null && userId != null && ownerId == userId) {
                isOwner = true;
            } else {
                isOwner = false;
            }
        });
    });
}

function renderEditPage() {
	var state = wave.getState();

    var targetTime = state.get('target_time');
    var digits = state.get('digits');
    var displayCircles = state.get('display_circles');
    var circlesColor = state.get('circles_color');

	var html = "";
	var htmlHeader = "";
	var htmlFooter = "";

    html += "<p style='font-size: 14px;'>Choose digits to display:</p>";

    if (digits != null && digits == "days") {
        html += "<input type='radio' name='digits' value='all'>Days with hour/min/sec</input>";
        html += "</br>";
        html += "<input type='radio' name='digits' value='days' checked='true'>Days only</input>";
    } else {
        html += "<input type='radio' name='digits' value='all' checked='true'>Days with hour/min/sec</input>";
        html += "</br>";
        html += "<input type='radio' name='digits' value='days'>Days only</input>";
    }

    html += "</br>";

    html += "<p style='font-size: 14px;'>Countdown style:</p>";

    if (displayCircles != null && displayCircles == false) {
        html += "<input type='checkbox' name='circles' value='true'>Display circles</input>";
    } else {
        html += "<input type='checkbox' name='circles' value='true' checked='true'>Display circles</input>";
    }

    html += "</br>";

    html += "<p style='font-size: 14px;'>Pick circle color:</p>";

    if (circlesColor != null && circlesColor != "") {
        html += "<input id='picker' class='color' value='" + circlesColor + "'/>";
    } else {
        html += "<input id='picker' class='color' value='40484F'/>";
    }

    html += "</br>";

    html += "<p style='font-size: 14px;'>Enter date for the Final Countdown:</p>";

    if (targetTime != null && targetTime != "") {
        html += "<input id='target_date_picker' type='text' value='" + targetTime + "'/>";
        selectedDate = targetTime;
    } else {
        html += "<input id='target_date_picker' type='text'/>";
    }

    html += "</br>";
    html += "</br>";

    html += "<button id='saveButton' onclick='updateCountdown()''>Save</button>";
    html += "<button id='cancelButton' onclick='renderCountdown()''>Cancel</button>";

    html += "<p>";
    html += "Please report issues to IT direct component ";
    html += "<a target='_blank' href='https://itdirect.wdf.sap.corp/sap(bD1lbiZjPTAwMSZkPW1pbg==)/bc/bsp/sap/crm_ui_start/default.htm?saprole=ZITSERVREQU&crm-object-type=AIC_OB_INCIDENT&crm-object-action=D&PROCESS_TYPE=ZINE&CAT_ID=IMAS_JAM'>'IMAS_Jam'</a>";
    html += ", feedback to ";
    html += "<a target='_blank' href='https://jam4.sapjam.com/groups/about_page/3B960zLBubCXJjPjDT59T5'>SAP Jam Support Center</a>";
    html += ".";
    html += "</p>";

    htmlHeader += "<h3>Settings:</h3>";

    document.getElementById('body').innerHTML = html;
    document.getElementById('footer').innerHTML = htmlFooter;
    document.getElementById('header').innerHTML = htmlHeader;

    $("#target_date_picker").datetimepicker({
        inline:true,
        minDate: '-1970/01/01',
        onChangeDateTime:function(dp, $input){
            selectedDate = $input.val();
        }
    });

    var colorPicker = new jscolor.color(document.getElementById('picker'), {});
    colorPicker.fromString($("#picker").val());
}

function renderCountdown() {
    if (!wave.getState()) {
        return;
    }
    var state = wave.getState();

    var targetTime = state.get('target_time');
    var digits = state.get('digits');
    var circlesColor = state.get('circles_color');
    var displayCircles = state.get('display_circles');

    checkIfOwner();

    if (targetTime != null && digits != null) {
    	drawCountdown(digits, targetTime, displayCircles, circlesColor);
    } else {
        if (isOwner) {
    	   renderEditPage();
        } else {
            setTimeout(function(){
                if (isOwner) {
                   renderEditPage();
                }
            }, 2000);
        }
    }

    gadgets.window.adjustHeight();
    setTimeout(function(){
        gadgets.window.adjustHeight();
    }, 1500);
}

function init() {
    if (wave && wave.isInWaveContainer()) {
        wave.setStateCallback(renderCountdown);

        wave.setParticipantCallback(renderCountdown);
    }
}

gadgets.util.registerOnLoadHandler(init);