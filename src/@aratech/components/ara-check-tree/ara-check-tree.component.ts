import { Component, Injectable, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { of as ofObservable, Observable, BehaviorSubject } from 'rxjs';
import { TodoItemNode, TodoItemFlatNode, AraTreeController, ChecklistDatabase } from '../ara-tree/ara-tree.component';

@Component({
  selector: 'ara-check-tree',
  templateUrl: 'ara-check-tree.component.html',
  styleUrls: ['ara-check-tree.component.scss'],
  providers: [ChecklistDatabase]
})
export class AraCheckTreeComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName: string = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  @Input("title") title: String;
  @Input("dataSource") treeData: any;
  @Input("controller") controller: AraTreeController<any>;
  @Input("idField") idField: string = 'id';
  @Input("textField") textField: string = 'text';
  @Input("expandAll") expandAll: boolean = false;
  selected: any = {};

  constructor(private database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }

  ngOnInit() {
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    this.database.initialize(this.treeData);
    

    var me = this;
    this.controller.getAllSelected = function (): any[] {
      let results: any[] = [];
      me.nestedNodeMap.forEach(node => {
        if (me.checklistSelection.isSelected(node) || me.descendantsPartiallySelected(node))
          results.push(node.item);
      });
      return results;
    }

    this.controller.getSelected = function (): any[] {
      let results: any[] = [];
      me.nestedNodeMap.forEach(node => {
        if (me.checklistSelection.isSelected(node))
          results.push(node.item);
      });
      return results;
    }

    if(this.controller.treeData) {
      me.initData(this.controller.treeData);
    }

    this.controller.dataChange.subscribe(function (data: any) {
      me.initData(data);
    });

    this.controller.onUnCheckAllCallBack.subscribe(function (data: any) {
      me.unCheckAll();
    });
  }

  initData(data: any) {
    this.database.initialize(data);

      if (this.expandAll)
      this.treeControl.expandAll();
  }

  change(node) {
    this.selected = node;
    this.controller.onChange.emit(node);
  }

  getLevel = (node: TodoItemFlatNode) => { return node.level; };

  isExpandable = (node: TodoItemFlatNode) => { return node.expandable; };

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.children);
  }

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.item === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.item === node.item
      ? this.nestedNodeMap.get(node)!
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    let descendants = this.treeControl.getDescendants(flatNode);

    if (descendants.length == 0 && flatNode.item['checked'] === true)
      this.checklistSelection.select(flatNode);

    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode, event: any): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    event.checked
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  checkAll(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }
  }

  unCheckAll(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if(this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
    }
    this.treeControl.collapseAll();
  }
}