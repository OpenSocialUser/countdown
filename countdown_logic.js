var isOwner = false;
var selectedDate = "";

function toJSON(obj) { 
	return gadgets.json.stringify(obj); 
}

function toObject(str) {
    return gadgets.json.parse(str);
}

function updateCountdown(){
	var state = wave.getState();

	var clockType = document.getElementById('link_to_rss').value;
    var digits = document.getElementById('link_to_rss').value;
    var targetTime = parseInt(document.getElementById('entries_to_display').value);

	if (rssLink != null && rssLink != "") {
        if (entries_to_display != null && entries_to_display >= 1 && entries_to_display <= 25) {
            document.getElementById('entries_to_display').value = '';
            state.submitDelta({'entries_to_display' : entries_to_display});
        } else {
            document.getElementById('entries_to_display').value = '';
            state.submitDelta({'entries_to_display' : 3});
        }
		document.getElementById('link_to_rss').value = '';
		state.submitDelta({'rss_link' : rssLink});
		requestRSS(rssLink);
	}
}

function drawCountdown(clockType, targetTime, digits) {    

}

function normalizeDate(date) {
	var dateString = "";
	dateString += (date.getMonth() + 1).toString() + '/';
	dateString += date.getDate().toString() + '/';
	dateString += date.getFullYear().toString();
	dateString += "  ";
	dateString += date.getHours().toString() + ":";
	dateString += date.getMinutes().toString();

	return dateString;
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

	var clockType = state.get('clock_type');
    var targetTime = state.get('target_time');
    var digits = state.get('digits');

	var html = "";
	var htmlHeader = "";
	var htmlFooter = "";

	html += "<p style='font-size: 14px;'>Choose clock type:</p>";
	if (clockType != null && clockType == "digital") {
        html += "<input type='radio' name='clock_type' value='circle'>Circle</input>";
        html += "</br>";
		html += "<input type='radio' name='clock_type' value='digital' checked='true'>Digital</input>";
	} else {
        html += "<input type='radio' name='clock_type' value='circle' checked='true'>Circle</input>";
        html += "</br>";
        html += "<input type='radio' name='clock_type' value='digital'>Digital</input>";
    }

    html += "</br>";

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

    html += "<p style='font-size: 14px;'>Enter date for the Final Countdown:</p>";

    if (targetTime != null && targetTime != "") {
        html += "<input id='target_date_picker' type='text' value='" + targetTime + "'/>";
        selectedDate = targetTime;
    } else {
        html += "<input id='target_date_picker' type='text'/>";
    }

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

    document.getElementById('body').innerHTML = html;
    document.getElementById('footer').innerHTML = htmlFooter;
    document.getElementById('header').innerHTML = htmlHeader;

    $("#target_date_picker").datetimepicker({
        inline:true,
        minDate: '-1970/01/01',
        onChangeDateTime:function(dp, $input){
            alert($input.val());
            selectedDate = $input.val();
        }
    });
}

function renderCountdown() {
    if (!wave.getState()) {
        return;
    }
    var state = wave.getState();
    var clockType = state.get('clock_type');
    var targetTime = state.get('target_time');
    var digits = state.get('digits');

    checkIfOwner();

    if (clockType != null && clockType != "" && targetTime != null && digits != null) {
    	drawCountdown(clockType, targetTime, digits);
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