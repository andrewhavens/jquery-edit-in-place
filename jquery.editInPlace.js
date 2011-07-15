(function($){
	
	$.fn.editInPlace = function(params){
		
		var config = $.extend({}, {
			editActionSelector: '.edit',
			deleteActionSelector: '.delete'
		}, params);
		
		return this.each(function(){
			initRow($(this));
		});
		
		function initRow($row){
			// TODO: this only works if the row is a div
			$row.wrapInner('<div class="data"></div>');
			var $formWrapper = $('<div class="form"></div>').hide().appendTo($row);
			
			$row.find(config.editActionSelector).click(function(e){
				e.preventDefault();
				doEditAction($(this), $row, $formWrapper);
			});
			
			$row.find(config.deleteActionSelector).click(function(e){
				e.preventDefault();
				doDeleteAction($(this), $row);
			});
		}
		
		function doEditAction($editLink, $row, $formWrapper){
			if ($formWrapper.is(':visible')) {
				return; //do nothing
			}
			var url = $editLink.attr('href');
			$.get(url, function(data){
				$formWrapper.html(data).slideDown();
				$formWrapper.find('.cancel').click(function(e){
					e.preventDefault();
					cancelEdit($formWrapper);
				});
				$formWrapper.find('form').submit(function(e){
					e.preventDefault();
					saveEdits($(this), $row);
				});
			});
		}
		
		function cancelEdit($formWrapper){
			$formWrapper.slideUp();
		}
		
		function saveEdits($form, $row){
			var $formWrapper = $form.closest('.form');
			$.ajax({
				type: 'POST',
				url: $form.attr('action'),
				data: $form.serialize(),
				success: function(data){
					$formWrapper.slideUp();
				},
				error: function(jqXHR, textStatus, errorThrown){
					console.log(jqXHR);
					console.log(jqXHR.status);
					console.log(textStatus);
					console.log(errorThrown);
					if (!data.errorMessages) {
						alert('An error occurred while trying to save the record. Please try again later.');
					} else {
						alert('400 error code');
						var $errors = $('<div class="errors"></div>').html(data.errorMessages);
						$formWrapper.prepend($errors);
					}
				}
			});
		}
		
		function doDeleteAction($deleteLink, $row){
			if (confirm('Are you sure?')) {
				$.ajax({
					type: 'DELETE',
					url: $deleteLink.attr('href'),
					success: function(data){
						$row.find('.data').fadeTo('slow', 0, function(){
							$row.slideUp();
						});
					},
					error: function(data){
						alert('An error occurred while trying to delete the record.');
					}
				});
			}
		}
	};
	
})(jQuery);