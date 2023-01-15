import {
  _decorator,
  CCFloat,
  clamp01,
  Color,
  Component,
  Enum,
  Material,
  Node,
  Sprite,
  Texture2D,
} from "cc";
const { ccclass, property, requireComponent } = _decorator;

enum TransitionType {
  NONE,
  TRANSITION_TEXTURE,
  FADE,
  LEFT_RIGHT,
  CURTAIN_FALL,
  VERTICAL_REFLECTED_WIPE,
  SPINNING_PIZZA_SLICE,
  FLOCKS,
  FLIP_FLOCKS,
}

Enum(TransitionType);

@ccclass("TransitionController")
@requireComponent(Sprite)
export class TransitionController extends Component {
  @property({ visible: false })
  private _transitionTexture: Texture2D | null = null;

  @property(Texture2D)
  get transitionTexture() {
    return this._transitionTexture;
  }

  set transitionTexture(value: Texture2D) {
    this._transitionTexture = value;

    const mat = this.getMat();
    if (
      mat &&
      this.transitionType === TransitionType.TRANSITION_TEXTURE &&
      this._transitionTexture.isValid
    ) {
      mat.setProperty("transitionTexture", this._transitionTexture, 0);
    }
  }

  @property({ visible: false })
  private _transitionColor = new Color();

  @property(Color)
  get transitionColor() {
    return this._transitionColor;
  }

  set transitionColor(value: Color) {
    this._transitionColor = value;

    const mat = this.getMat();
    if (mat && this._transitionColor) {
      mat.setProperty("transitionColor", this._transitionColor, 0);
    }
  }

  @property({ type: TransitionType, visible: false })
  private _transitionType = TransitionType.NONE;

  @property({type: TransitionType})
  get transitionType() {
    return this._transitionType;
  }

  set transitionType(value: TransitionType) {
    this._transitionType = value;
    this.updateDefines(value);
  }

  sprite: Sprite | null = null;

  @property({ type: CCFloat, visible: false })
  private _cutoff = 0.0;

  @property(CCFloat)
  get cutoff() {
    return this._cutoff;
  }

  set cutoff(value: number) {
    this._cutoff = clamp01(value);
    this.setSpriteCutoff(this._cutoff);
  }

  private defines = {
    USE_TRANSITION_TEXTURE: false,
    USE_FADE: false,
    USE_LEFT_RIGHT: false,
    USE_CURTAIN_FALL: false,
    USE_VERTICAL_REFLECTED_WIPE: false,
    USE_SPINNING_PIZZA_SLICE: false,
    USE_FLOKS: false,
    USE_FLIP_FLOKS: false,
  };

  onLoad() {
    this.sprite = this.getComponent(Sprite);
  }

  start() {
    this.updateDefines(this.transitionType);
  }

  private initProperties() {
    this.cutoff = this.cutoff;
    this.transitionTexture = this.transitionTexture;
    this.transitionColor = this.transitionColor;
  }

  private getMat() {
    if (!this.sprite?.isValid) return null;
    const mat = this.sprite.getMaterialInstance(0);
    if (!mat?.isValid) return null;
    return mat;
  }

  private setSpriteCutoff(value: number) {
    const mat = this.getMat();
    if (!mat) return;
    mat.setProperty("cutoff", clamp01(value), 0);
  }

  private updateDefines(type: TransitionType) {
    const mat = this.getMat();
    if (!mat) return;

    const kTrue = `USE_${TransitionType[type]}`;
    Object.keys(this.defines).forEach((k) => {
        this.defines[k] = k === kTrue;
    });

    mat.recompileShaders(this.defines, 0);
    this.initProperties();
  }
}
