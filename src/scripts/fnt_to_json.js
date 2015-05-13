// Run using node
var fs = require('fs'),

    fontName = process.argv[2],
    isAllUnicode = process.argv[3] === '--isAllUnicode';

fs.readFile(fontName + '.fnt', function(err, data) {
    'use strict';

    if (err) { throw err; }

    var lines = data.toString().split('\n'),
        output = {
            chars: {}
        };

    lines.forEach(function(line) {
        var properties = line.split(' '),
            propertyName = properties.shift(),
            possibleCharID, currentNode, idValue;

        // ignore blank lines
        if (line.replace(/ /g).length === 0) {
            return;
        }

        idValue = parseInt(properties[0].split('=')[1], 10);

        if (isAllUnicode) {
            possibleCharID = String.fromCharCode(idValue);
        } else {
            possibleCharID = idValue.toString(16);
        }

        switch (propertyName) {
            case 'char':
                currentNode = output.chars[possibleCharID] = {};
                break;
            default:
                currentNode = output[propertyName] = {};
                break;
        }

        properties.forEach(function(keyValueString) {
            var keyValuePropertyTuple = keyValueString.split('='),
                propertyKey = keyValuePropertyTuple[0],
                propertyValue = keyValuePropertyTuple[1] || '',
                parsedValue = parseInt(propertyValue, 10);

            if (!propertyKey && !propertyValue) {
                return;
            }

            if (isNaN(parsedValue)) {
                currentNode[propertyKey] = propertyValue.replace(/"/g, '');
            } else {
                currentNode[propertyKey] = parsedValue;
            }
        });
    });

    fs.writeFile(
        fontName + '.json',
        JSON.stringify(output),
        function(err) {
            if (err) {
                throw err;
            } else {
                console.log('successfully wrote ' + fontName + '.json');
            }
        }
    );
});
