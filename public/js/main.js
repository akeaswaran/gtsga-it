
function findCard(cards, cardId) {
	var card = {};
	for (var i = 0; i < cards.length; i++) {
		var curCard = cards[i];
		if (curCard._id === cardId) {
			card = curCard;
			console.log(JSON.stringify(card));
			return card;
		}
	}
}

function deleteCard(cardId) {
	if(confirm('Do you want to delete this card?')) {
		$.ajax({
				type: 'DELETE',
				contentType: 'application/json',
				dataType: 'json',
				url: '/cards/' + cardId,
				success: function(data) {
					var card = data;
					$('#card-' + cardId).remove();
				},
				error: function(error) {
					if (error.status != 200) {
						$('#errorText').html(error.message);
						$('#errorMsg').show();
					} else {
						$('#card-' + cardId).remove();
					}
				 }
		});
	}
}

function createCard(card) {
	var deleteString = 'deleteCard(\'' + card._id + '\')';
	var assignees = card.assignees;
	var emails = card.assigneeEmails;
	var assigneeString = 'assigned to <a href=\"mailto:' + card.assigneeEmails[0] + '\">' + card.assignees[0] + '</a>';
	if (assignees.length > 2) {
		for (var i = 1; i < assignees.length; i++) {
			var addAssignee = ', <a href=\"mailto:' + card.assigneeEmails[i] + '\">' + card.assignees[i] + '</a>';
			if (i === assignees.length - 1) {
				addAssignee = ', and <a href=\"mailto:' + card.assigneeEmails[i] + '\">' + card.assignees[i] + '</a>';
			}
			assigneeString += addAssignee;
		}
	} else if (assignees.length === 2) {
		assigneeString += ' and <a href=\"mailto:' + card.assigneeEmails[1] + '\">' + card.assignees[1] + '</a>';
	} else {
		assigneeString = 'assigned to <a href=\"mailto:' + card.assigneeEmails[0] + '\">' + card.assignees[0] + '</a>';
	}
	var statusString = 'info';
	if (card.status === 'backlog') {
		statusString = 'info';
	} else if (card.status === 'in-progress') {
		statusString = 'warning'
	} else {
		statusString = 'success';
	}

	var cardHtml = '<div id="card-' + card._id + '" class="panel panel-' + statusString + ' card ' + card.status + '"><div class="panel-heading">' + card.title + '<button type="button" class="close" onClick="' + deleteString + '" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="panel-body"><p>' + card.description + '</p></div><div class="panel-footer">' + assigneeString + '</div></div>';
	if (card.status === 'backlog') {
		$('#backlogWell').append(cardHtml);
	} else if (card.status === 'in-progress') {
		$('#progressWell').append(cardHtml);
	} else {
		$('#doneWell').append(cardHtml);
	}

	$('.card').draggable({
		containment: '.container-fluid',
		stack: '.wells',
		snap: '.well',
		snapTolerance: '20px',
		snapMode: 'inner',
		cursor: 'move',
		revert: true
	});
}

function updateCard(cards, cardId, status) {
	var card = findCard(cards, cardId);
	card.status = status;
	$.ajax({
			type: 'PUT',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(card),
			url: '/cards/' + cardId,
			success: function(data) {
				console.log('SUCCESS UPDATE TO ' + card.status);
			},
			error: function(error) {
				if (error.status != 200) {
					$('#errorText').html(error.message);
					$('#errorMsg').show();
				} else {
					console.log('SUCCESS UPDATE');
				}
			 }
	});
}

function sendEmailToAssignees(card) {
	$.ajax({
			type: 'POST',
			data: JSON.stringify(card),
			contentType: 'application/json',
			dataType: 'json',
			url: '/emailAssignees',
			success: function(data) {
				console.log(data);
			},
			error: function(error) {
					$('#errorText').html(error.message);
					$('#errorMsg').show();
			 }
	});
}

function addCard(cardDict) {
	$.ajax({
			type: 'POST',
			data: JSON.stringify(cardDict),
			contentType: 'application/json',
			dataType: 'json',
			url: '/cards',
			success: function(data) {
				var card = data;
				createCard(card);
				$('#card-title').val('');
				$('#card-description').val('');
				$('#card-assignee').val('');
				$('#card-assigneeEmail').val('');
				sendEmailToAssignees(card);
			},
			error: function(error) {
					$('#errorText').html(error.message);
					$('#errorMsg').show();
			 }
	});
}

$(document).ready(function() {
	var numCards = 0;
	var cards = [];
	$.get('/cards', function(data) {
		numCards = data.length;
		for (var i = 0; i < data.length; i++) {
			var card = data[i];
			cards.push(card);
			createCard(card);
		}
	});

	$('#progressWell').droppable({
		accept: '.card',
		drop: function(ev, ui) {
		 var dropped = ui.draggable;
		 var droppedOn = $(this);
		 $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
		 $(dropped).removeClass('backlog');
		 $(dropped).removeClass('done');
		 $(dropped).addClass('in-progress');
		 $(dropped).removeClass('panel-info');
		 $(dropped).removeClass('panel-success');
		 $(dropped).addClass('panel-warning');
		 var cardId = $(dropped).attr('id').replace('card-','');
		 updateCard(cards, cardId, "in-progress");
		}
	});

	$('#backlogWell').droppable({
		accept: '.card',
		drop: function(ev, ui) {
		 var dropped = ui.draggable;
		 var droppedOn = $(this);
		 $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
		 $(dropped).addClass('backlog');
		 $(dropped).removeClass('done');
		 $(dropped).removeClass('in-progress');
		 $(dropped).addClass('panel-info');
		 $(dropped).removeClass('panel-success');
		 $(dropped).removeClass('panel-warning');
		 var cardId = $(dropped).attr('id').replace('card-','');
		 updateCard(cards, cardId, "backlog");
		}
	});

	$('#doneWell').droppable({
		accept: '.card',
		drop: function(ev, ui) {
		 var dropped = ui.draggable;
		 var droppedOn = $(this);
		 $(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);
		 $(dropped).removeClass('backlog');
		 $(dropped).addClass('done');
		 $(dropped).removeClass('in-progress');
		 $(dropped).removeClass('panel-info');
		 $(dropped).addClass('panel-success');
		 $(dropped).removeClass('panel-warning');
		 var cardId = $(dropped).attr('id').replace('card-','');
		 updateCard(cards, cardId, "done");
		}
	});

	$('#saveButton').on('click', function(event) {
		event.preventDefault();
		$('#newCardModal').modal('toggle');
		if ($.trim($('#card-title').val()).length > 0 && $.trim($('#card-description').val()).length > 0 && $.trim($('#card-assignee').val()).length > 0 && $.trim($('#card-assigneeEmail').val()).length > 0) {
			var cardAssigneeList;
			if ($('#card-assignee').val().indexOf(',')) {
				cardAssigneeList = $('#card-assignee').val().split(',');
			} else {
				cardAssigneeList = [$('#card-assignee').val()];
			}

			var cardAssigneeEmailList;
			if ($('#card-assigneeEmail').val().indexOf(',')) {
				cardAssigneeEmailList = $('#card-assigneeEmail').val().split(',');
			} else {
				cardAssigneeEmailList = [$('#card-assigneeEmail').val()];
			}

			if (cardAssigneeList.length == cardAssigneeEmailList.length) {
				var card = {
					"title" : $('#card-title').val(),
					"description" : $('#card-description').val(),
					"assignees": cardAssigneeList,
					"assigneeEmails" : cardAssigneeEmailList,
					"status" : "backlog",
					"notificationsEnabled" : $('#card-notificationsEnabled').val()
				};
				console.log('VALID INPUT - CARD: ' + JSON.stringify(card));
				addCard(card);
			} else {
				console.log('INVALID INPUT');
				$('#errorText').html('Include emails for all assignees');
				$('#errorMsg').show();
			}
		} else {
			console.log('INVALID INPUT');
			$('#errorText').html('You\'ve input invalid data for this card. Please fix the information and try again.');
			$('#errorMsg').show();
		}
	});
});
