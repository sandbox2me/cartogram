Signed Distance Fields
====

What?
----

Signed distance fields help text look better. Picasso provides a mechanism to make
text look better. You can provide a font and using a couple tools we can optimize
the rendering for a webgl scene.

## Some demos

- http://hack.chrons.me/opengl-text-rendering/
- https://www.mapbox.com/blog/text-signed-distance-fields/
- https://mapbox.s3.amazonaws.com/kkaefer/sdf/index.html

How to make your own?
----

1. Get brew

2. Build libgdx https://github.com/libgdx/libgdx/wiki/Building-libgdx-from-source

    brew install ant
    # you may also need java
    git clone git@github.com:libgdx/libgdx.git
    cd libgdx
    ant -f fetch.xml
    ant

3. Run Hiero

    cd dist
    java -cp gdx.jar:gdx-natives.jar:gdx-backend-lwjgl.jar:gdx-backend-lwjgl-natives.jar:extensions/gdx-tools/gdx-tools.jar com.badlogic.gdx.tools.hiero.Hiero

4. Play with Hiero https://github.com/libgdx/libgdx/wiki/Distance-field-fonts

    - Remove the default "Color" effect by clicking the X.
    - Set the color of the distance field if you like. It is best to leave this set to white, because you can change the color at rendering time.
    - Set the "Spread" to a suitable value. It should be about half the width of the thickest lines in your font, in pixels. At most, there should be small regions of bright white; don't lose too much contrast.
    - In the bottom right corner, set the "Padding" on all four sides to be equal to the spread. You should see that your glyphs are no longer being clipped.
    - Set the "X" and "Y" to minus twice the spread. If you used a spread of 4, you'd set -8 for both X and Y. This is necessary because the padding increases the spacing between glyphs at rendering time.
    - Select the "Glyph cache" radio button and set the page size such that all glyphs fit on one page, with as little waste as possible. This makes loading easier.
    - Set the "Scale" to something larger than 1. We save this step for last because the higher the scale, the slower the font generation gets. 32 is a good value. You should now have something like this

5. I like to modify the names in the .fnt file to match the file name

6. Run `node ./fnt_to_json.js myfont` to get a JSON blob with information about each font. Note: if fnt_to_json stops working, I bet it'd be because the format of .fnt changed.

7. If you are using all unicode fonts eg, everything is represented like \uf002 then make sure to pass the `--isAllUnicode` flag. `node ./fnt_to_json.js myfont --isAllUnicode`. If you want something fancier, feel free to contribute to this script :)!
