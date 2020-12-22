var maskOption = ["255.0.0.0", "255.128.0.0", "255.192.0.0", "255.224.0.0", "255.240.0.0", "255.248.0.0", "255.252.0.0", "255.254.0.0", "255.255.0.0", "255.255.128.0", "255.255.192.0", "255.255.224.0", "255.255.240.0", "255.255.248.0", "255.255.252.0", "255.255.254.0", "255.255.255.0", "255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.248", "255.255.255.252"];
var subnetBitsOption = [];
var maskBitsOption = [];
var hostPer = [];
var maxSubnetsOption = [];
var option = [];
var networkClass;

function selectIf(i) {
    var select;
    if (i === 0) {
        select = document.getElementById("subnetMask");
    } else if (i === 1) {
        select = document.getElementById("subnetBits");
    } else if (i === 2) {
        select = document.getElementById("maskBits");
    } else if (i === 3) {
        select = document.getElementById("hostPer");
    } else {
        select = document.getElementById("maxSubnets");
    }
    return select;
}

function jValue(type, i) {
    switch (type) {
        case "a":
            if (i === 0) {
                return [0, maskOption.length]
            } else if (i === 1) {
                return [0, subnetBitsOption.length];
            } else if (i === 2) {
                return [0, maskBitsOption.length]
            } else if (i === 3) {
                return [0, hostPer.length]
            } else {
                return [0, maxSubnetsOption.length]
            }
        case "b":
            if (i === 0) {
                return [8, maskOption.length]
            } else if (i === 1) {
                return [0, 15];
            } else if (i === 2) {
                return [8, 23];
            } else if (i === 3) {
                return [0, 15];
            } else {
                return [0, 15];
            }
        case "c":
            if (i === 0) {
                return [16, maskOption.length]
            } else if (i === 1) {
                return [0, 7];
            } else if (i === 2) {
                return [16, 23];
            } else if (i === 3) {
                return [0, 7];
            } else {
                return [0, 7];
            }
    }
}
//load the global arrays based on the selected Classes
function dropdownLoads(type) {
    var select;
    var allArrays = [maskOption, subnetBitsOption, maskBitsOption, hostPer, maxSubnetsOption];
    for (var i = 0; i < 5; i++) {
        select = selectIf(i); //get the selction type
        var x = jValue(type, i); //load from type the index x to y
        for (var j = x[0]; j < x[1]; j++) { // add in the selection tag the options
            option[j] = document.createElement('option');
            option[j].value = j;
            option[j].innerHTML = allArrays[i][j];
            select.appendChild(option[j]);
        }
    }
}

/**
 * Function removes all the options from the select
 */
function clear() {
    var select;
    for (var i = 0; i < 5; i++) {
        select = selectIf(i);
        select.innerHTML = "";
    }
}

function decToHex() {
    var hex = document.getElementById("ipBtn").value;
    var split = hex.split(".");
    for (var i = 0; i < split.length; i++) {
        split[i] = Number(split[i]).toString(16).toUpperCase();
    }
    document.getElementById("hexIP").value = split.join(".");
}

function wildCardMask() {
    var x = document.getElementById("subnetMask").selectedIndex;
    var y = document.getElementById("subnetMask").options;
    var split = y[x].text.split(".");
    for (var i = 0; i < 4; i++) {
        split[i] = 255 - split[i];
    }
    document.getElementById("wildCardMask").value = split.join(".");
}

function broadCastIP() {
    var ip = document.getElementById("ipBtn").value;
    var splitIp = ip.split(".");
    var x = document.getElementById("subnetMask").selectedIndex;
    var y = document.getElementById("subnetMask").options;
    var split = y[x].text.split(".");
    var ignore = networkClass + 1;
    for (var i = 0; i < ignore; i++) {
        split[i] = splitIp[i];
    }
    for (var i = ignore; i < 4; i++) {
        split[i] = 255 - split[i];
    }
    document.getElementById("broadCast").value = split.join(".");
}

function subnetID() {
    var ip = document.getElementById("ipBtn").value;
    var split = ip.split(".");
    split[split.length - 1] = "0";
    document.getElementById("subnetID").value = split.join(".");
}

function hostRange() {
    var ip = document.getElementById("ipBtn").value;
    var split = ip.split(".");
    split[split.length - 1] = "1";
    var part1 = split.join(".");
    split = ip.split(".");

    var wildCard = document.getElementById("wildCardMask").value;
    var splitWild = wildCard.split(".");
    for (var i = 0; i < 4; i++) {
        if (splitWild[i] > 0 && i < 3) {
            split[i] = splitWild[i];
        } else if (i >= 3) {
            var temp = parseInt(splitWild[i]) - 1;
            split[i] = temp.toString();
        }

    }
    var part2 = split.join(".");
    document.getElementById("hostRange").value = part1 + " - " + part2;
}

function LoadFields(type, key) {
    //if key is null means that we have to preload the "IP Address" TextField
    if (key === null) {
        if (type === 0) {
            return "10.0.0.1";
        } else if (type === 1) {
            return "172.16.0.1";
        } else if (type === 2) {
            return "192.168.0.1";
        }
    } else {
        var array = ["1", "127", "128", "191", "192", "223"];
        var ip = document.getElementById("ipBtn").value;
        var split = ip.split(".");
        var temp;
        for (var i = 0; i < 3; i++) {
            if (type === i) {
               if (split[0] < array[i * 2]) {
                    temp = parseInt(split[0], 10) + 1;
                    split[0] = temp.toString();
                } else if (split[0] > array[(i * 2) + 1]) {
                    temp = parseInt(split[0], 10) - 1;
                    split[0] = temp.toString();
                }
                return document.getElementById("ipBtn").value = split.join(".");
            }
        }


    }

}

function toBinary(split , len) {
    for (var i = 0; i < len; i++) {
        split[i] = Number(split[i]).toString(2);
    }
    return split;
}

function cidr() {
    var x = document.getElementById("subnetMask").selectedIndex;
    var y = document.getElementById("subnetMask").options;
    var split = y[x].text.split(".");
    split = toBinary(split, 4);
    var temp;
    var counter = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 8; j++) {
            temp = parseInt(split[i]) % 10;
            if(temp === 1){
                counter++;
            }
            split[i] /= 10;
        }
    }
    document.getElementById("cidr").value = document.getElementById("ipBtn").value + "/" + counter;
}

function changeSettings(type) {
    var x = document.getElementById(type).selectedIndex;
    var y = document.getElementById(type).options;
    var i;
    for (i = 0; i < y.length; i++) {
        if (y[x].text === y[i].text) {
            break;
        }
    }
    for (var j = 0; j < 5; j++) {
        var x = selectIf(j);
        document.getElementById(x.id).selectedIndex = i;
    }
    wildCardMask();
    hostRange();
    broadCastIP();
    cidr();
    bitmap();
    binarySubnetMask();
}

function bitmap() {
    var type = networkClass;
    var x = document.getElementById("subnetMask").selectedIndex;
    var y = document.getElementById("subnetMask").options;
    var split = y[x].text.split(".");
    var bits = [];
    switch (type) {
        case 0:
            bits[0] = "0";
        break;
        case 1:
            bits[0] = "1";
            bits[1] = "0";
        break;
        case 2:
            bits[0] = "1";
            bits[1] = "1";
            bits[2] = "0";
        break;
    }
    document.getElementById("bit").value = "";
    for (var i = bits.length; i < 8 * (type+1); i++) {
        bits[i] = "n";
        if((i+1) % 8 === 0){
            document.getElementById("bit").value += bits.join("") + ".";
            bits.splice(0, bits.length);
        }
    }
    document.getElementById("bit").value += bits.join("");
    split.splice(0, type + 1);
    var len = 4 - (type+1);
    split = toBinary(split, len);
    var dBits = [];
    var temp;
    for (var i = 0; i < 3 - type; i++) {
        for (var j = 0; j < 8; j++) {
            temp = parseInt(split[i]) % 10;
            if(temp === 1){
                dBits[j] = "s";
            }else {
                dBits[j] = "h";
            }
            if(j+1 === 8){
                dBits.reverse();
                if(i === (3 - type - 1)){
                    document.getElementById("bit").value += dBits.join("");
                }else{
                    document.getElementById("bit").value += dBits.join("") + ".";
                }
                dBits.splice(0, dBits.length);
            }
            split[i] /= 10;
        }
    }

}

function binarySubnetMask() {
    var x = document.getElementById("subnetMask").selectedIndex;
    var y = document.getElementById("subnetMask").options;
    var split = y[x].text.split(".");
    split = toBinary(split, 4);
    for (var i = 0; i < split.length; i++) {
        for (var j = split[i].length; j < 8; j++) {
            split[i] = "0" + split[i];
        }
    }
    document.getElementById("binarySubnet").value = split.join(".");
}

function binaryIp() {
    var ip = document.getElementById("ipBtn").value;
    var split = ip.split(".");
    split = toBinary(split, 4);
    for (var i = 0; i < split.length; i++) {
        for (var j = split[i].length; j < 8; j++) {
            split[i] = "0" + split[i];
        }
    }
    document.getElementById("binaryIP").value = split.join(".");
}

/**
 * This function loads and creates all the necessary Fields based on the Subnet-Class
 * @param type is the type of the selected Subnet-Class
 * @param key is a Variable that checks if
 */
function load(type, key) {
    networkClass = type;
    var i = 0;
    //create the necessary Fields
    for (var j = 24; j > 1; j--) {
        hostPer[i] = Math.pow(2, j) - 2;
        i++;
    }
    for (var j = 0; j < 23; j++) {
        maxSubnetsOption[j] = Math.pow(2, j);
        subnetBitsOption[j] = j;
    }
    for (var j = 8; j < 31; j++) {
        maskBitsOption[j - 8] = j;
    }
    //before loading clear the input Fields
    clear();
    switch (networkClass) {
        //Class A
        case 0:
            document.getElementById("ipBtn").value = LoadFields(networkClass, key);
            document.getElementById("octetRange").value = "1 - 126";
            dropdownLoads("a");
            break;
        case 1:
            document.getElementById("ipBtn").value = LoadFields(networkClass, key);
            document.getElementById("octetRange").value = "128 - 191";
            dropdownLoads("b");
            break;
        case 2:
            document.getElementById("ipBtn").value = LoadFields(networkClass, key);
            document.getElementById("octetRange").value = "192 - 223";
            dropdownLoads("c");
            break;

    }
    decToHex();
    wildCardMask();
    broadCastIP();
    subnetID();
    hostRange();
    cidr();
    binarySubnetMask();
    binaryIp();
    bitmap();

}

