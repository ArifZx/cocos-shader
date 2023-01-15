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

  @property({ type: TransitionType })
  transitionType = TransitionType.NONE;

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

  onLoad() {
    this.sprite = this.getComponent(Sprite);
  }

  start() {
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
}
