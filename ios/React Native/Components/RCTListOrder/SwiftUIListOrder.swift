//
//  SwiftUIListOrder.swift
//  nativeUIModulesTest
//
//  Created by Dominic Go on 7/4/20.
//

import SwiftUI



struct SwiftUIListOrder: View {
  
  @ObservedObject var configVM    = ListOrderConfigViewModel();
  @ObservedObject var listOrderVM = ListOrderViewModel();
  
  var body: some View {
    List {
      ForEach(listOrderVM.listItems.indices, id: \.self) { index in
        VStack(alignment: .leading) {
          Group {
            Unwrap(self.listOrderVM.listItems[index].title){ title in
              Text("\(index + 1). ")
                .fontWeight(.bold)
                .foregroundColor(.blue)
              + Text(title);
            };
          }
          .lineLimit(2)
          .padding(.bottom, 5.0);
          
          Unwrap(self.listOrderVM.listItems[index].description){ desc in
            Unwrap(self.configVM.config.descLabel){ label in
              Text(label)
                .fontWeight(.bold)
              + Text(desc)
                .fontWeight(.light)
            }.font(.subheadline);
          };
        }.listRowInsets( EdgeInsets(
          top     : 10,
          leading : 15,
          bottom  : 10,
          trailing: 12
        ));
      }
      .onMove(perform: move)
      .onDelete(perform: delete)
    }
    .environment(
      \.editMode,
      self.configVM.config.isEditable ? .constant(.active) : .constant(.inactive)
    );
  };
  
  func move(from source: IndexSet, to destination: Int) {
    self.listOrderVM
        .listItems
        .move(fromOffsets: source, toOffset: destination);
  };
  
  func delete(at offsets: IndexSet) {
    self.listOrderVM
        .listItems
        .remove(atOffsets: offsets)
  };
};

struct SwiftUIListOrder_Previews: PreviewProvider {
  static var previews: some View {
    SwiftUIListOrder(
      configVM   : ListOrderConfigViewModel(),
      listOrderVM: ListOrderViewModel()
    )
  }
}
