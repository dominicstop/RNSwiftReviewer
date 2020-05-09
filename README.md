## Todo

- [ ] Add support for adding Images
- [ ] QuizCreateQuestionModal - Improve UI
- [ ] QuizCreateQuestionModal - Identification: add options for how the answer is checked (i.e numerical, numerical accuracy, text, ignore case, ignore whitespace, ignore special characters, min. levenstein distance for checking how similar the answer is, max/min characters, fuzzy checking etc.)
- [ ] QuizCreateQuestionModal - Identification: add section for typing the answer to try out the options
- [ ] QuizCreateQuestionModal - Add character count
- [ ] QuizCreateQuestionModal - Multiple Choice: add swipe to delete choices
- [ ] QuizCreateQuestionModal - Increase choices limit to 5
- [ ] QuizCreateQuestionModal - Add input limit
- [ ] QuizAddQuestionModal - Add footer
- [ ] QuizAddSectionModal - Editing: allow editng of type when there's no questions yet
- [ ] CreateQuizScreen: fixed transition from 1 item to 0.

- [ ] QuizCreateQuestionModal - Add Question preview when choosing answer
- [ ] QuizSessionDoneModal - Change the loading indicator when tap to jump
- [ ] ViewQuizModal - Make quiz session item title thicker/bigger
- [ ] ViewQuizModal - Sort quiz session list from newest to oldest
- [ ] ViewQuizModal - Adj. section title style
- [ ] AddNewSectionModal - Fix AddNewSection discard logic
- [ ] Store - Update clear logic to clear cache + index
- [ ] Add haptic feedback

- [ ] Create generic button component with custom press in/out animations, active/inactive state and debouncing
- [ ] Dark Mode support

- [ ] Refactor to use Immutability helper for nested state
- [ ] Refactor wrap on press handlers inside debounce to prevent multiple invocations
- [ ] Refactor: move model extract method to helpers (reduce duplicated code)
- [ ] Sort: Record scroll pos + Don't scroll to top when sorting if below threshold
- [ ] Record header height + Add snap to offset for header
- [ ] CreateQuizModal: replace input icons
- [ ] Refactor:  QuizListItem - pass down quizes as props, and use PropKeys to access them
- [ ] enable/disable colors for footer section buttons
- [ ] ModalInputField: Add character count when focused
- [ ] ModalInputField: add support for separate sticky header
- [ ] ModalInputField: combine with ModalInputMultiline
- [ ] Modals - prevent swipeToDimss when there are unsaved changes
- [x] When cancel is pressed, prompt actionSheet/Alert and ask to discard changes 
- [x] Don't show check animation when no changes in modal
- [x] Refactor: rename ListCardEmpty to ListCardImageTitleBody
- [x] Create Initial QuizScreenList layout
- [x] Finish TabBar
- [x] Remove react-native-ionicons
- [x] handle/fix list scrollbar offsets + compute header/tabBar height
- [x] fix LargeTitleSectionList extra bottom padding
- [x] handle list extra padding for LargeTitle
- [x] implement sorting logic
- [x] Refactor SortKeysQuiz to SortTypesQuiz
- [x] Refactor SortKeysExam to SortTypesExam


- [x] Test whether or not RN and RNN can be combined togther in a single project
  * Use RNN for modals, and use RN for everything else
  * Test whether or not RNS can be used

- [ ] Migrate wix/react-native-navigation modals to use the built in modal comp.
  * Everytime a new modal is presented, the comps are wrapped inside a new, seperate react-native instance w/ it's own VC.
  * For every modal opened, there's about 5 to 10% increase in cpu usage (Tested: Release build, iPhone XR/6S). Could be a bug, or i configured rnn wrong.
  * both rnn modals and rn's modals supports the native ios 12 modalPresentation style, but rnn impl. is more customizable and concise. Both has support for scroll view drag to close.
  * Use RNN modal in situations where swipeDown gesture needs to be disabled.

### Bugs
- [ ] Bugfix: Dark Apperance affects blur views
- [ ] Bugfix: Fix scroll offset bug when on production build
- [ ] Bugfix: fix sort animation header
- [ ] Bugfix: fix scroll to top sorting behaviour
- [ ] Bugfix: question choices order not preserved when created/edited
- [x] Bugfix: fix scrollview offset bug in modals
