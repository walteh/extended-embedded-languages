/**
 * Build the syntax definition for C++ as a host language
 * @param {HostSpec} hostSpec - Specification for the host language
 * @param {EmbeddedSpec[]} embeddedSpecs - Array of data about each
 * embedded language
 * @returns {json} - Json object containing a TextMate language
 * injection
 */
export function buildCppSyntax(hostSpec, embeddedSpecs) {
    // Build the patterns that match each embedded language, using
    // a raw string with a start and stop marker
    // Example: R"sql(...)sql"
    const embeddedPatterns = embeddedSpecs.map((lang) => {
        return {
            'comment': `${lang.name}-formatted raw strings`,
            'begin': String.raw`(?x)
\b 
( (?:u|U|L|u8)? R ) " 
( (?i:${lang.id_choice_re}) \b [^\(]* ) 
\(`,
            'end': String.raw`\)(\2)"`,
            'contentName': `meta.embedded.string.raw.${lang.vsname}.${hostSpec.vsname} ${lang.root_scope}`,
            'patterns': [{ 'include': `${lang.root_scope}` }],
            'name': 'string.quoted.double.raw.embedded.cpp',
            'beginCaptures': {
                '0': { 'name': 'punctuation.definition.string.begin.cpp' },
                '1': { 'name': 'meta.encoding.cpp' }, // Encoding (U, u8, etc..)
                '2': { 'name': 'meta.encoding.cpp' }, // Language (json, py, sql, etc...)
            },
            'endCaptures': {
                '0': { 'name': 'punctuation.definition.string.end.cpp' },
                '1': { 'name': 'meta.encoding.cpp' },
            },
        };
    });

    // Build the overall grammar injection file, and include the
    // patterns from above
    const syntax = {
        '$schema': 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
        'injectionSelector': `L:source.cpp -comment -string -meta.preprocessor.diagnostic`,
        'scopeName': `${hostSpec.embedded_scope}`,
        'comment': `This file has been automatically generated by syntax_assembler.js
DO NOT HAND EDIT IT - changes will be lost.`,
        'patterns': [{ 'include': '#raw_strings' }],
        'repository': {
            'raw_strings': {
                'comment':
                    'These patterns all match C++ raw strings and select one language. The syntax is injected into ' +
                    'https://github.com/microsoft/vscode/blob/main/extensions/cpp/syntaxes/cpp.tmLanguage.json',
                'patterns': embeddedPatterns,
            },
        },
    };

    return syntax;
}

