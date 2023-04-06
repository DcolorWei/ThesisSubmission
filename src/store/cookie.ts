//记录cookie方法
export function setCookie(name: string, value: string, days: number) {
    let d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
}
//获取cookie方法
export function getCookie(name: string) {
    let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
//删除cookie方法
export function deleteCookie(name: string) {
    setCookie(name, '', -1);
}