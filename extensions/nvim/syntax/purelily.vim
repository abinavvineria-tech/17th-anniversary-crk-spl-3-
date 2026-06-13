" PureLily 17 - Neovim Syntax Highlighting
" 🌸 The official programming language of the Cookie Kingdom
" 🎉 Celebrating 17 Years of Cookie Run!

if exists('b:current_syntax')
  finish
endif

syn case match

" Keywords — Royal Gold (#D4AF37)
syn keyword lilyKeyword      bloom ancient wish friend heal iflight moonpath repeat timeflow
syn keyword lilyKeyword      let const fn return if else for while match when
syn keyword lilyKeyword      import from export pub self super mod as is not and or
syn keyword lilyKeyword      struct trait impl enum type ref mut static
syn keyword lilyKeyword      true false none

" Async keywords — Timekeeper Purple (#8B5CF6)
syn keyword lilyAsync        await timeflow async

" Constants — Ancient Gold (#B8860B)
syn match lilyConstant       '\<[A-Z][A-Z0-9_]\+\>'

" Types — Hollyberry Crimson (#C0392B)
syn keyword lilyType         Cookie Kingdom Dragon Recipe Friendship int float string bool

" Module names — Moonlight Blue (#4A90D9)
syn keyword lilyModule       friendship kingdom vanilla lily hollyberry cacao cheese
syn keyword lilyModule       timekeeper seafairy moonlight windarcher frostqueen
syn keyword lilyModule       blackpearl dragon beast anniversary
syn keyword lilyModule       friends core game light wisdom strength night treasury
syn keyword lilyModule       flow ocean dreams forest winter abyss flame celebration

" Strings — White Lily Green (#2ECC71)
syn region lilyString        start='"' end='"' contains=lilyEscape
syn match  lilyEscape        '\\[\\"nrt0]' contained

" Numbers — Golden Cheese Yellow (#F1C40F)
syn match lilyNumber         '\<\d\+\(\.\d\+\)\?\>'

" Comments — Frost Queen Cyan (#1ABC9C)
syn match lilyComment        '//.*$' contains=lilyTodo
syn region lilyComment       start='(\*' end='\*)' contains=lilyTodo
syn keyword lilyTodo         TODO FIXME XXX HACK NOTE contained

" Functions — Pure Vanilla Cream (#F5DEB3)
syn match lilyFunction       '\<\h\w*\>\(\s*(\)\@='

" Operators — Royal Gold (#D4AF37)
syn match lilyOperator       '[+\-*/%=<>!&|^~]'

" Delimiters
syn match lilyDelimiter      '[(){}[\],;:.#@]'

" Error — Burning Spice Orange (#FF6B35)
syn match lilyError          '\<error\>'

" Warning — Mystic Flour Violet (#9B59B6)
syn match lilyWarning        '\<warning\>'

" Success — Emerald Green (#2ECC71)
syn match lilySuccess        '\<success\>'

" Highlight links
hi def link lilyKeyword      lilyKeyword
hi def link lilyAsync        lilyAsync
hi def link lilyString       lilyString
hi def link lilyEscape       SpecialChar
hi def link lilyNumber       lilyNumber
hi def link lilyFunction     lilyFunction
hi def link lilyType         lilyType
hi def link lilyModule       lilyModule
hi def link lilyComment      lilyComment
hi def link lilyTodo         Todo
hi def link lilyConstant     lilyConstant
hi def link lilyOperator     lilyOperator
hi def link lilyDelimiter    Delimiter
hi def link lilyError        lilyError
hi def link lilyWarning      lilyWarning
hi def link lilySuccess      lilySuccess

let b:current_syntax = 'purelily'
