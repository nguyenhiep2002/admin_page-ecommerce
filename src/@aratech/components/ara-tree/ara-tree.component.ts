import { Component, Injectable, Input, EventEmitter, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { of as ofObservable, Observable, BehaviorSubject } from 'rxjs';


/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: Object;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
    item: Object;
    level: number;
    expandable: boolean;
}

export class AraTreeController<T> {
    onChange: EventEmitter<any> = new EventEmitter<any>();
    onAdd: EventEmitter<any> = new EventEmitter<any>();
    onEdit: EventEmitter<any> = new EventEmitter<any>();
    onDelete: EventEmitter<any> = new EventEmitter<any>();
    onAddNodeCallBack: EventEmitter<any> = new EventEmitter<any>();
    onInitDataCallBack: EventEmitter<any> = new EventEmitter<any>();
    onExpandAllCallBack: EventEmitter<any> = new EventEmitter<any>();
    onUnCheckAllCallBack: EventEmitter<any> = new EventEmitter<any>();
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    treeData: any;
    constructor(data?: any) {
        this.treeData = data;
    }

    addNode(parentId: String, data: any) {
        this.onAddNodeCallBack.emit({ parentId: parentId, data: data });
    }

    initData(data: any) {
        this.onAddNodeCallBack.emit(data);
        this.dataChange.next(data);
    }

    getSelected() : any[]{
        return [];
    }

    getAllSelected() : any[]{
        return [];
    }

    unCheckAll() {
        this.onUnCheckAllCallBack.emit();
    }
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({providedIn: 'root'})
export class ChecklistDatabase {
    dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);

    get data(): TodoItemNode[] { return this.dataChange.value; }

    constructor() {

    }

    initialize(data: any) {
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        //     file node as children.
        const treeData = this.buildFileTree(data, 0);
        // Notify the change.
        this.dataChange.next(treeData);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(values: any[], level: number) {
        let data: any[] = [];

        if (values && Array.isArray(values)) {
            values.forEach(value => {
                let node = new TodoItemNode();
                node.item = value;
                let childs = value.childrens;

                if (childs && Array.isArray(childs) && childs.length > 0) {
                    node.children = this.buildFileTree(childs, level + 1);
                }
                data.push(node);
            });
        }

        return data;
    }

    /** Add an item to to-do list */
    insertItem(parent: TodoItemNode, data: any) {
        const child = <TodoItemNode>{ item: data };
        if (parent.children) {
            parent.children.push(child);
            this.dataChange.next(this.data);
        }
    }

    updateItem(node: TodoItemNode, name: string) {
        node.item = name;
        this.dataChange.next(this.data);
    }
}

/**
 * @title Tree with checkboxes
 */
@Component({
    selector: 'ara-tree',
    templateUrl: 'ara-tree.component.html',
    styleUrls: ['ara-tree.component.scss'],
    providers: [ChecklistDatabase]
})
export class AraTreeComponent implements OnInit {
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
    @Input("showAddButton") showAddButton: boolean = false;
    @Input("showDeleteButton") showDeleteButton: boolean = false;
    @Input("showEditButton") showEditButton: boolean = false;
    @Input("addButtonTitle") addButtonTitle: string = '';
    
    selected: any = {};

    constructor(private database: ChecklistDatabase) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    ngOnInit() {
        this.database.initialize(this.treeData);
        this.database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });

        var database = this.database;
        this.controller.onAddNodeCallBack.subscribe(function (data: any) {
            database.initialize(data);
        });
    }

    change(node) {
        this.selected = node;
        this.controller.onChange.emit(node);
    }

    add() {
        this.controller.onAdd.emit();
    }

    edit(node) {
        this.controller.onEdit.emit(node);
    }

    delete(node) {
        this.controller.onDelete.emit(node);
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
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
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
}