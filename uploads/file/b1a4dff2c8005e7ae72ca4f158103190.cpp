#include <iostream>
//#include <conio.h>
#include <malloc.h>
//#include <Windows.h>
using namespace std;

#define MaxLength 400

typedef struct{
	int cols;
	int rows;
	int matrix[35][35];
}Graphic;

//trang thai cua node
typedef struct{
	int x;
	int y;	
}State;

typedef struct Node{
	State state;
	struct Node* parent;
	int f;
	int no_function;
}Node;


typedef int Position; 
typedef struct {
	Node* Elements[MaxLength];  //store elements of list
	Position Last; //store the current length of list
} List;

// List initialization
void makeNull_List(List *L) { 
	L->Last=0; 
}

//Check list is empty or not
int empty_List(List L){
	return L.Last==0;
}

// Check l? is full or not?
int full_List(List L)
{
	return L.Last==MaxLength;
} 

// return the first position of list
Position First(List L){
	return 1;
}

// return the lastest position of list
Position EndList(List L){
	return L.Last+1;
}

Node* element_at(Position P,List L){
	if (P<1 || P>L.Last){
		cout << "The position " << P << " is out of list";
		return NULL;
	}
	return L.Elements[P-1];
}
Position Next(Position P, List L){
	if (P<1 || P>L.Last){
		cout << "The position " << P << " is out of list";
		return -1;
	}
	return P+1;
}

void push_List(Node* X, Position P, List *L){
	if (L->Last==MaxLength)
		cout << "List is full";
	else if ((P<1) || (P>L->Last+1))
		cout << "The position " << P << " is illegal";
	else{
		Position Q;	
		for(Q=(L->Last-1)+1;Q>P-1;Q--)
			L->Elements[Q]=L->Elements[Q-1];	
		
		L->Elements[P-1]=X;
		L->Last++;
	}
}

void del_in_List(Position P,List *L){
	if ((P<1) || (P>L->Last))
		cout << "The position " << P << " is illegal";
	else if (empty_List(*L))
		cout << "List is empty";
	else{
		Position Q;
		for(Q=P-1;Q<L->Last-1;Q++)
		L->Elements[Q]=L->Elements[Q+1];
		
		L->Last--;
	}
}

Position Locate(Node* X, List L){
  Position P;
	int Found = 0;
	P = First(L); 
	while ((P != EndList(L)) && (Found == 0))
		if (element_at(P,L) == X) Found = 1;
		else P = Next(P, L);
	return P;
} 


State startPoint, endPoint;
int maxCol, maxRow;

//void readData(path) __attribute__ ((constructor));

void readData(Graphic graphic){
	
	int x, y;
	int startX, startY, endX, endY;
	
	FILE *file;	
	file = fopen("maze2.txt", "r");
	fscanf(file, "%d%d%d%d%d%d", &maxCol, &maxRow, &startX, &startY, &endX, &endY);	
	
	graphic.rows = maxRow;
	graphic.cols = maxCol;
	
	startPoint.x = startX;
	startPoint.y = startY;
	
	endPoint.x = endX;
	endPoint.y = endY;
		
	
	for(x = 0; x < maxCol; x++){
		for(y = 0; y < maxRow; y++){
			int el;
			fscanf(file, "%d", &el);
			graphic.matrix[x][y] = el;
//			printf("%d ", el);
		}
//		printf("\n");
	}

	
	fclose(file);
}

//huong di chuyen cua ndde
int up(State state, State *result, Graphic graph){
    *result = state;
    int x = state.x;
    int y = state.y;

    if(result->y > 0)
		if(graph.matrix[x][y-1] != 1){
	        result->y = state.y - 1;
	        return 1;
    	}
    return 0;
}
int down(State state, State *result, Graphic graph){
    *result = state;
    int x = state.x;
    int y = state.y;

    if(result->y < maxRow-1)
		if(graph.matrix[x][y+1] != 1){
        	result->y = state.y + 1;
        	return 1;
    	}
    return 0;
}

int left(State state, State *result, Graphic graph){
    *result = state;
    int x = state.x;
    int y = state.y;

    if(result->x > 0 )
		if(graph.matrix[x-1][y] != 1){
        	result->x = state.x - 1;
        	return 1;
   		}
    return 0;
}

int right(State state, State *result, Graphic graph){
    *result = state;
    int x = state.x;
    int y = state.y;

    if(result->x < maxCol - 1)
		if(graph.matrix[x+1][y] != 1){
        	result->x = state.x + 1;
        	return 1;
    	}
    return 0;
}

void printState(State state){
	printf("(%d, %d)", state.x, state.y);
}

//so sanh 2 state

int compareState(State s1, State s2){
	if(s1.x == s2.x && s1.y == s2.y)
		return 1;
	return 0;
}

//goi ham di chuyen cho node
int callOperators(State state, State *result, Graphic graph, int option){
    switch(option){
        case 1: return up(state, result, graph);
        case 2: return down(state, result, graph);
        case 3: return left(state, result, graph);
        case 4: return right(state, result, graph);
        default: printf("Cannot call operators!");
            return 0;
    }
}


//tim trang thai state trong list va tra ve pos 

Node* find_in_List(State state, List list, int *pos){
	int i;
	for(i = 1; i <= list.Last; i++){
		if(compareState(element_at(i,list)->state, state)){
			*pos = i;
			return element_at(i, list);
		}
	}
	
	return NULL;
}

//sap xep list buble sort
void sort_List(List *list){
	int i, j;
	for(i = 0; i < list->Last-1; i++){
		for(j = i+1; j < list->Last; j++){
			if(list->Elements[i]->f > list->Elements[j]->f){
				Node* temp = list->Elements[i];
				list->Elements[i] = list->Elements[j];
				list->Elements[j] = temp;
			}
		}
	}
}


//ham tinh heuristic
int f_calc(State startPoint, State endPoint){
	int startPointX = startPoint.x;
	int startPointY = startPoint.y;
	
	int endPointX = endPoint.x;
	int endPointY = endPoint.y;
	
	int diffX = endPointX - startPointX;
	int diffY = endPointY - startPointY;
	
	int diff = diffX + diffY;
	
	return diff;
}

//check goal
int goal_check(State s1, State s2){
	if(compareState(s1, s2)){
		return 1;
	}
	return 0;
}


Node* best_first_search(State startPoint, State endPoint, Graphic graph){
		List open;
		List close;
		
		makeNull_List(&open);
		makeNull_List(&close);
//		printf("123");
		
		//size cua node
		Node* root = (Node*)malloc(sizeof(Node));
		
		
		root->state = startPoint;
		root->parent = NULL;
		root->no_function = 0;
		
//		printf("sdsd");
		root->f = f_calc(startPoint, endPoint);
		push_List(root, 1, &open);
		
//		printState(root->state);
//		printf("12");		
		while(!empty_List(open)){
			
			Node* node = element_at(1, open);
			del_in_List(1, &open);
						
			push_List(node, 1, &close);
			
			if(goal_check(node->state, endPoint)){
				return node;
			}
			
			int option;
			
			//up down left right
			for(option = 1; option <= 4; option++){
				State newState;
				newState = node->state;
				
				if(callOperators(node->state, &newState, graph, option)){
					Node* newNode = (Node*)malloc(sizeof(Node));
					
					newNode->parent = node;
					newNode->no_function = option;
					newNode->state = newState;
					newNode->f = f_calc(newState, endPoint);
					
					int posOpen, posClose;
					Node* foundInOpen = find_in_List(newState, open, &posOpen);
					Node* foundInClose = find_in_List(newState, close, &posClose);
					
					if(foundInOpen == NULL && foundInClose == NULL){
						push_List(newNode, 1, &open);
					} else if(foundInOpen != NULL && foundInOpen->f > newNode->f){
						del_in_List(posOpen, &open);
						push_List(newNode, 1, &open);
					} else if(foundInClose != NULL && foundInClose->f > newNode->f){
						del_in_List(posClose, &close);
						push_List(newNode, 1, &open);
					}
					sort_List(&open);
				}
			}
			
		}
		return NULL;
}

void printS(Node* node){
	

	if(node->parent != NULL){
		printS(node->parent);
	}
	

	printState(node->state);
}

int main(){
	Graphic graphic;

//	readData(graph);
	int x, y;
	int startX, startY, endX, endY;
	
	FILE *file;	
	file = fopen("maze2.txt", "r");
	fscanf(file, "%d%d%d%d%d%d", &maxCol, &maxRow, &startX, &startY, &endX, &endY);	
	
	graphic.rows = maxRow;
	graphic.cols = maxCol;
	
	startPoint.x = startX;
	startPoint.y = startY;
	
	endPoint.x = endX;
	endPoint.y = endY;
		
	
	for(x = 0; x < maxCol; x++){
		for(y = 0; y < maxRow; y++){
			int el;
			fscanf(file, "%d", &el);
			graphic.matrix[x][y] = el;
//			printf("%d ", el);
		}
//		printf("\n");
	}

	fclose(file);
	
	Node* node = (Node*)malloc(sizeof(Node));
	
	node = best_first_search(startPoint, endPoint, graphic);
	
//	int i, j;
//	
//	for(i = 0; i < maxCol; i++){
//		for(j = 0; j < maxRow; j++){
//			printf("%d ", graphic.matrix[i][j]);
//		}
//		printf("\n");
//	}
	
	printS(node);
	
	
//	printState(node->state);
	


	return 0;
}




