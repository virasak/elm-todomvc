module MousePosition where

import Mouse

main: Signal Element
main = lift asText Mouse.position
