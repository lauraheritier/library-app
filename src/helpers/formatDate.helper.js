exports.formatDate = (date, isCreate, displayOnly) => {
    if (isCreate) {
        const todayDate = new Date();
        const month = todayDate.getMonth() + 1;
        const formatDay = todayDate.getDate() < 10 ? `0${todayDate.getDate()}` : todayDate.getDate();
        const formatMonth = (todayDate.getMonth() + 1) < 10 ? `0${(todayDate.getMonth()) + 1}` : todayDate.getMonth() + 1;
        const formatDate = [todayDate.getFullYear(), formatMonth, formatDay].join('-');
        return formatDate;
    } else {
        if(displayOnly) {
            let formattedToDate;
            let rawDate = new Date(date);
            let month = rawDate.getMonth();
            let formatMonth = (rawDate.getMonth() + 1) < 10 ? `0${(rawDate.getMonth()) + 1}` : rawDate.getMonth() + 1;
            let day = (rawDate.getDate() +1) < 10 ? `0${rawDate.getDate() +1}` : rawDate.getDate() +1;
            formattedToDate = [day, formatMonth, rawDate.getFullYear()].join('/');
            return formattedToDate;
        } else {
            let formattedToDate;
            let rawDate = new Date(date);
            let month = rawDate.getMonth();
            let formatMonth = (rawDate.getMonth() + 1) < 10 ? `0${(rawDate.getMonth()) + 1}` : rawDate.getMonth() + 1;
            let day = rawDate.getDate() < 10 ? `0${rawDate.getDate()}` : rawDate.getDate();
            formattedToDate = [day, formatMonth, rawDate.getFullYear()].join('/');
            return formattedToDate;
        }        
    }
}