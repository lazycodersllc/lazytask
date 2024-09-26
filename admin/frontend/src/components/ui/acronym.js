export default function acronym(name = '') {

    const wordCount = name
        .split(/\s+/)
        .filter(Boolean).length;

    if (wordCount === 1) {
        return name.toUpperCase().slice(0, 2)
    }
    const shortName = name.match(/\b(\w)/g)

    if (shortName) {
        return shortName.join('').toUpperCase().slice(0, 2)
    }

    return name.toUpperCase().slice(0, 2)
}
