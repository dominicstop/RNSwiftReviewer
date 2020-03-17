## Todo

- [x] Refactor SortKeysQuiz to SortTypesQuiz
- [x] Refactor SortKeysExam to SortTypesExam
- [ ] Refactor to use Immutability helper for nested state
- [ ] Bugfix: Fix scroll offset bug when on production build
- [ ] Sort: Record scroll pos + Don't scroll to top when sorting if below threshold
- [ ] Record header height + Add snap to offset for header
- [ ] CreateQuizModal: replace input icons
- [ ] Refactor: rename ListCardEmpty to ListCardImageTitleBody
- [ ] Bugfix: Dark Apperance affects blur views

- [x] Create Initial QuizScreenList layout
- [x] Finish TabBar
- [x] Remove react-native-ionicons
- [x] handle/fix list scrollbar offsets + compute header/tabBar height
- [x] fix LargeTitleSectionList extra bottom padding
- [x] handle list extra padding for LargeTitle
- [x] implement sorting logic
- [ ] fix sort animation header
- [ ] fix scroll to top sorting behaviour
- [x] Test whether or not RN and RNN can be combined togther in a single project
  * Use RNN for modals, and use RN for everything else
  * Test whether or not RNS can be used

- [] Migrate wix/react-native-navigation modals to use the built in modal comp.
  * Everytime a new modal is presented, the comps are wrapped inside a new, seperate react-native instance w/ it's own VC.
  * For every modal opened, there's about 5 to 10% increase in cpu usage (Tested: Release build, iPhone XR/6S). Could be a bug, or i configured rnn wrong.
  * both rnn modals and rn's modals supports the native ios 12 modalPresentation style, but rnn impl. is more customizable and concise. Both has support for scroll view drag to close.