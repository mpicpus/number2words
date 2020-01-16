document.addEventListener('DOMContentLoaded', () => {
	// Organized dictionary.
	// [baseName, teensName, tensPrefix]
	let numbersDictionary = {
		0: ['zero', 'ten'],
		1: ['one', 'eleven'],
		2: ['two', 'twelve', 'twen'],
		3: ['three', 'thirteen', 'thir'],
		4: ['four', null, 'for'],
		5: ['five', 'fifteen', 'fif'],
		6: ['six'],
		7: ['seven'],
		8: ['eight', 'eighteen', 'eigh'],
		9: ['nine']
	}


	// Main parsing toolbox magic object.
	// Could also have been a class, but why bother...?
	let parser = {
		teenifyNext: false,
		hundrifyNext: false,
		thousifyNext: false,
		overThousifyNext: false,

		// Units. Will also handle teens if present.
		0: (n) => {
			let response = '';
			let and = this.hundrifyNext ? ' and ' : '';
			
			this.hundrifyNext = false;

			if (this.teenifyNext) {
				response = numbersDictionary[n][1] ?
       `${numbersDictionary[n][1]}` :
       ` ${numbersDictionary[n][0]}teen`;

       this.teenifyNext = false;
     } else if (n != '0') {
      response = numbersDictionary[n][0];
    } else 
    and = '';

    return ` ${and}${response}`;
  },

		// Tens.
		1: (n) => {
			let response = '';
			let and = this.hundrifyNext ? ' and ' : '';

			if (n == '1') {
				this.teenifyNext = true;
				this.hundrifyNext = false;
			} else if (n != '0') {
				response = ` ${numbersDictionary[n][2] ? numbersDictionary[n][2] : numbersDictionary[n][0]}ty`;
				this.hundrifyNext = false;
			} else
      and = '';

      return `${and}${response}`;
    },

		// Hundreds.
		2: (n) => {
			response = '';
			this.hundrifyNext = this.thousifyNext || n !='0';
      

			if (n != '0') {
				response = `${this.thousifyNext ? ', ' : ' '}${numbersDictionary[n][0]} hundred`;
			}

			this.thousifyNext = false;

			return `${response}`
		},

		// Thousands.
		3: (n) => {
			let response = '';
			let and = this.hundrifyNext ? ' and ' : '';
			this.hundrifyNext = false;

			if (this.teenifyNext)
				response = parser[0](n)
			else if (n != '0') {
				response = numbersDictionary[n][0];
			} else
      and = '';

      this.thousifyNext = true;
      return ` ${and}${response} thousand`;
    },

		// Tens of thousands.
		4: (n) => {
			return parser[1](n);
		},

		// Hundreds of thousands.
		5: (n) => {
			return parser[2](n);
		}
	}


	// Main DOM elements.
	let formElement = document.querySelector('#input');
	let responseElement = document.querySelector('.response');

	formElement.focus();


	// Main event. Will fire on <enter>.
	formElement.addEventListener('change', () => {
		responseElement.innerHTML = formElement.value ? onFormChanged(formElement.value) : ' ';
	})

	function onFormChanged(value) {
		value = cleanInput(value);
		formElement.value = value;

		let split = value.split('');

		let splitProcessed = split.map((n, index, arr) => {
			return isNumber(n) && parser[arr.length - index - 1] ? parser[arr.length - index - 1](n) : '';
		});

		return cleanOutput(splitProcessed.join(''));
	}


	// Utils
	function cleanInput(input) {
		return input.replace(/[^0-9]|^0+/g, '');
	}

	function cleanOutput(output) {
		let response = capitalize(output.replace(/^ +| +$/g, ''));
		return response == '' ? '"Zero"' : `"${response}"`;
	}

	function isNumber(input) {
		return input.match(/[0-9]/) ? true : false
	}

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}
}, false);
