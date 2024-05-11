/**
 * Build the syntax definition for Powershell as a host language
 * @param {HostSpec} hostSpec - Specification for the host language
 * @param {EmbeddedSpec[]} embeddedSpecs - Array of data about each
 * embedded language
 * @returns {json} - Json object containing a TextMate language
 * injection
 */
export function buildPowerShellSyntax(hostSpec, embeddedSpecs) {
    // Build the patterns that match each embedded language, using
    // a raw string prefixed by an inline comment
    // Example: /*sql*/ @"..."@
    const embeddedPatterns = embeddedSpecs.map((lang) => {
        return {
            comment: `${lang.name}-formatted raw strings`,
            begin: String.raw`(?x)
( (<\#) \s* 
(?i:${lang.id_choice_re})
\s* (\#>) )
\s* (@['"])
\s*$`,
            end: String.raw`^(['"]@)`,
            contentName: `meta.embedded.block.${lang.vsname}.${hostSpec.vsname} ${lang.root_scope}`,
            patterns: [{ include: `${lang.root_scope}` }],
            beginCaptures: {
                1: { name: 'comment.block.powershell' },
                2: { name: 'punctuation.definition.comment.block.begin.powershell' },
                3: { name: 'punctuation.definition.comment.block.end.powershell' },
                4: { name: 'string.quoted.single.heredoc.powershell punctuation.definition.string.begin.powershell' },
            },
            endCaptures: {
                1: { name: 'string.quoted.single.heredoc.powershell punctuation.definition.string.end.powershell' },
            },
        };
    });

    // Build the overall grammar injection file, and include the
    // patterns from above
    const syntax = {
        $schema:
      'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
        injectionSelector: `L:source.powershell -comment -string`,
        scopeName: `${hostSpec.embedded_scope}`,
        comment: `This file has been automatically generated by syntax_assembler.js
DO NOT HAND EDIT IT - changes will be lost.`,
        patterns: [{ include: '#raw_strings' }],
        repository: {
            raw_strings: {
                comment:
          'These patterns match Powershell multiline strings and select one language. The syntax is injected into ' +
          'https://github.com/PowerShell/EditorSyntax/blob/master/PowerShellSyntax.tmLanguage',
                patterns: embeddedPatterns,
            },
        },
    };

    return syntax;
}
