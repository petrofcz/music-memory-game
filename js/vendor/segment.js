(function( $ ){
    $.fn.extend({
        Segment: function ( ) {
			$(this).each(function (){
				var self = $(this);
				var wrapper = $("<div>",{class: "ui-segment"});
				$(this).find("option").each(function (){
					var option = $("<span></span>");

                    for (i = 0; i < this.attributes.length; i++) {
                        var a = this.attributes[i];
                        option.attr(a.name, a.value);
                    }

                    option.addClass('option');
                    option.text($(this).text());
                    option.attr('value', $(this).val());

					if ($(this).is(":selected")){
						option.addClass("active");
					}
					wrapper.append(option);
				});
				wrapper.find("span.option").click(function (){
					wrapper.find("span.option").removeClass("active");
					$(this).addClass("active");
					self.val($(this).attr('value'));
				});
				$(this).after(wrapper);
				$(this).hide();
			});
        }
    });
})(jQuery);
