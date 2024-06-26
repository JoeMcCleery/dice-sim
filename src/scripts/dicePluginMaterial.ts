import {
  AbstractMesh,
  Color3,
  Engine,
  Material,
  MaterialDefines,
  MaterialPluginBase,
  Scene,
  SubMesh,
  Texture,
  UniformBuffer,
} from '@babylonjs/core';

/**
 * Extend from MaterialPluginBase to create your plugin.
 */
export default class DicePluginMaterial extends MaterialPluginBase {
  texture: Texture = new Texture('');
  colour: Color3 = new Color3();

  // we can add an enabled flag to be able to toggle the plugin on and off.
  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(enabled) {
    if (this._isEnabled === enabled) {
      return;
    }
    this._isEnabled = enabled;
    // when it's changed, we need to mark the material as dirty so the shader is rebuilt.
    this.markAllDefinesAsDirty();
    this._enable(this._isEnabled);
  }

  _isEnabled = false;

  constructor(material: Material, diceColour: Color3) {
    // the second parameter is the name of this plugin.
    // the third one is a priority, which lets you define the order multiple plugins are run. Lower numbers run first.
    // the fourth one is a list of defines used in the shader code.
    super(material, 'DiceMaterial', 200, { DICE: false });

    this.colour = diceColour;
  }

  // Also, you should always associate a define with your plugin because the list of defines (and their values)
  // is what triggers a recompilation of the shader: a shader is recompiled only if a value of a define changes.
  prepareDefines(defines: MaterialDefines, _scene: Scene, _mesh: AbstractMesh) {
    defines['DICE'] = this._isEnabled;
  }

  getClassName() {
    return 'DicePluginMaterial';
  }

  // here we can define any uniforms to be passed to the shader code.
  getUniforms() {
    return {
      // first, define the UBO with the correct type and size.
      ubo: [{ name: 'diceColour', size: 4, type: 'vec4' }],
      // now, on the fragment shader, add the uniform itself in case uniform buffers are not supported by the engine
      fragment: `#ifdef DICE
                    uniform vec4 diceColour;
                #endif`,
    };
  }

  getSamplers(samplers: string[]) {
    samplers.push('sdfTexture');
  }

  bindForSubMesh(
    uniformBuffer: UniformBuffer,
    _scene: Scene,
    _engine: Engine,
    _subMesh: SubMesh,
  ) {
    uniformBuffer.updateColor4('diceColour', this.colour, 1.0);
    uniformBuffer.setTexture('sdfTexture', this.texture);
  }

  getCustomCode(shaderType: string) {
    if (shaderType === 'fragment') {
      return {
        // convert: baseColor = texture2D(diffuseSampler, vDiffuseUV + uvOffset);
        // to:      baseColor = getBaseColour();
        '!baseColor\\=texture2D\\(diffuseSampler,vDiffuseUV\\+uvOffset\\);': `baseColor = getBaseColour();`,
        CUSTOM_FRAGMENT_DEFINITIONS: `
                uniform highp sampler2D sdfTexture;

                vec4 getBaseColour() {
	                float sdf = smoothstep(0.7, 0.71, texture2D(sdfTexture, vDiffuseUV).r);
                  return mix(diceColour, vDiffuseColor, sdf);
                }
            `,
      };
    }
    // for other shader types we're not doing anything, return null
    return null;
  }
}
