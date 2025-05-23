export default function isTextTruncated(idElement: string) {
    const element = document.getElementById(idElement);
    // Only use when the input is truncated with height
    return !!element && element.scrollWidth > element.clientWidth;
}
