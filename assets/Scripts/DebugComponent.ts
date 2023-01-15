import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugMatComponent')
export class DebugComponent extends Component {
    start() {
        const sprite = this.getComponent(Sprite);
        console.log(this.node.name, sprite);
    }

    update(deltaTime: number) {
        
    }
}


