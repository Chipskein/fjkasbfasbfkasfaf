function getStSigla(st_name) {
    if (!st_name) return "";
    st_name = st_name.trim();
    let st_sigla = "";
    const words = st_name.split(" ");
    if (words.length >= 2) {
        st_sigla = `${words[0][0]}${words[1][0]}`;
    } else if (st_name.length >= 2) {
        st_sigla = `${st_name[0]}${st_name[1]}`;
    } else {
        st_sigla = st_name[0];
    }
    return st_sigla.toUpperCase();
}
module.exports={
    getStSigla
}