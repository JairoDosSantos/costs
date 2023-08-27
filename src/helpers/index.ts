

function groupBy(list: any) {

    const usersByColor = list.reduce((acc: any, value: any) => {
        // Group initialization



        if (!acc[value.equipament.group.description]) {
            if (acc[value.equipament?.group_id]) {
                acc[value.equipament?.group_id].push(value);

            }
            acc[value.equipament.group.description] = [];
        }
        // Grouping
        acc[value.equipament.group.description].push(value);

        //   console.log(acc);

        return acc;

    }, {});

    return usersByColor
}


function removeAccentAndTidy(word: string) {
    word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    return word
}

const accentsTidy = function (s: string) {
    var r = s.toLowerCase();
    //  r = r.replace(new RegExp(/\s/g), "");
    r = r.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    //   r = r.replace(new RegExp(/\W/g), "");
    return r;
};


export { accentsTidy, groupBy, removeAccentAndTidy };

